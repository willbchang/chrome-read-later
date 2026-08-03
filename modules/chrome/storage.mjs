// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage

const LOCAL_SAVED_PREFIX = 'saved:'
const SYNC_RETRY_DELAY = 60000
let rebalancePromise
let syncRetryAfter = 0

const isSyncLimitError = error =>
    /quota|MAX_WRITE_OPERATIONS/i.test(error?.message)

function deferSyncRetry (error) {
    if (isSyncLimitError(error)) {
        syncRetryAfter = Date.now() + SYNC_RETRY_DELAY
    }
}

const canRetrySync = () => Date.now() >= syncRetryAfter

class Storage {
    constructor (where) {
        this.storage = chrome.storage[where]
    }

    get (key) {
        return new Promise((resolve, reject) => {
            this.storage.get(key, data => {
                const error = chrome.runtime.lastError
                error ? reject(new Error(error.message)) : resolve(data)
            })
        })
    }

    set (page) {
        return new Promise((resolve, reject) => {
            const data = page.url ? { [page.url]: page } : page
            this.storage.set(data, () => {
                const error = chrome.runtime.lastError
                error ? reject(new Error(error.message)) : resolve()
            })
        })
    }

    remove (key) {
        return new Promise((resolve, reject) => {
            this.storage.remove(key, () => {
                const error = chrome.runtime.lastError
                error ? reject(new Error(error.message)) : resolve()
            })
        })
    }

    clear () {
        return new Promise((resolve, reject) => {
            this.storage.clear(() => {
                const error = chrome.runtime.lastError
                error ? reject(new Error(error.message)) : resolve()
            })
        })
    }

    getBytesInUse (key) {
        return new Promise((resolve, reject) => {
            this.storage.getBytesInUse(key, bytes => {
                const error = chrome.runtime.lastError
                error ? reject(new Error(error.message)) : resolve(bytes)
            })
        })
    }

    // NOTICE: This returns an Array of objects.
    async sortByLatest () {
        const pages = await this.get()
        return Object.values(pages).
            filter(page => !page.isOptions).
            sort((a, b) => b.date - a.date)
    }

    async getPosition (url) {
        const pages = await this.get()
        const page = pages[url]
        return {
            scroll: {
                top:    page.scroll.top,
                height: page.scroll.height,
            },
            video:  {
                currentTime:  page.video.currentTime,
                playbackRate: page.video.playbackRate,
            },
        }
    }
}

class SyncStorage extends Storage {
    constructor () {
        super('sync')
    }

    async set (page) {
        await super.set(page)
        syncRetryAfter = 0
    }
}

class LocalStorage extends Storage {
    constructor () {
        super('local')
    }

    async get (key) {
        const data = await super.get(key)
        if (key) return data

        return Object.fromEntries(
            Object.entries(data)
                .filter(([storedKey]) => !storedKey.startsWith(LOCAL_SAVED_PREFIX))
        )
    }
}

class LocalSavedStorage extends Storage {
    constructor () {
        super('local')
        this.prefix = LOCAL_SAVED_PREFIX
    }

    async get (key) {
        if (key) {
            const prefixedKey = this.prefix + key
            const data = await super.get(prefixedKey)
            return data[prefixedKey] ? { [key]: data[prefixedKey] } : {}
        }

        const data = await super.get()
        return Object.fromEntries(
            Object.entries(data)
                .filter(([storedKey]) => storedKey.startsWith(this.prefix))
                .map(([storedKey, page]) => [storedKey.slice(this.prefix.length), page])
        )
    }

    set (page) {
        const data = page.url
            ? { [this.prefix + page.url]: page }
            : Object.fromEntries(
                Object.entries(page)
                    .map(([key, value]) => [this.prefix + key, value])
            )
        return super.set(data)
    }

    remove (key) {
        const prefixedKey = Array.isArray(key)
            ? key.map(value => this.prefix + value)
            : this.prefix + key
        return super.remove(prefixedKey)
    }

    async clear () {
        const pages = await this.get()
        const keys = Object.keys(pages)
        if (keys.length) await this.remove(keys)
    }
}

class SessionStorage extends Storage {
    constructor () {
        super('session')
    }

    async getArray (key) {
        const data = await this.get(key)
        return data[key]
    }

    async setArray (key, value) {
        const data = await this.getArray(key)
        data.push(value)
        await this.set({ [key]: data })
    }

    async popArray (key) {
        const data = await this.getArray(key)
        const result = data.pop()
        await this.storage.set({ [key]: data })
        return result
    }

    async initSessionKeys () {
        await this.set({ deletedSyncUrls: [] })
        await this.set({ deletedLocalUrls: [] })
    }
}

export const sync = new SyncStorage()
export const local = new LocalStorage()
export const localSaved = new LocalSavedStorage()
export const session = new SessionStorage()

export async function getOptions () {
    const { options: localOptions } = await local.get('options')
    const { options: syncOptions } = await sync.get('options')
    const options = {
        ...localOptions,
        ...syncOptions,
        hybrid: localOptions?.hybrid ?? localOptions?.localOnly ?? false,
    }
    delete options.localOnly
    return options
}

export async function setOptions (options) {
    const previousOptions = await getOptions()
    const nextOptions = { ...options }
    let modeError

    if (nextOptions.hybrid !== previousOptions.hybrid) {
        try {
            if (!nextOptions.hybrid) await copyLocalSavedPagesToSync()
        } catch (error) {
            nextOptions.hybrid = previousOptions.hybrid
            modeError = error
        }
    }

    const savedOptions = { ...nextOptions, isOptions: true }
    delete savedOptions.localOnly
    await local.set({ options: savedOptions })

    const syncOptions = { ...savedOptions }
    delete syncOptions.hybrid
    let syncError

    try {
        await sync.set({ options: syncOptions })
    } catch (error) {
        syncError = error
        console.warn('Read Later: options saved locally only.', error)
    }

    return {
        options:   savedOptions,
        modeError,
        syncError,
        error:     modeError || syncError,
    }
}

export async function sortSavedByLatest () {
    const options = await getOptions()
    if (!options.hybrid) return sync.sortByLatest()

    const [syncPages, overflowPages] = await Promise.all([
        sync.sortByLatest(),
        localSaved.sortByLatest(),
    ])
    const pagesByUrl = new Map(syncPages.map(page => [page.url, page]))
    overflowPages.forEach(page => pagesByUrl.set(page.url, page))
    return [...pagesByUrl.values()].sort((a, b) => b.date - a.date)
}

export async function getSavedPosition (url) {
    const options = await getOptions()
    if (options.hybrid) {
        const overflowPage = await localSaved.get(url)
        if (overflowPage[url]) return localSaved.getPosition(url)
    }
    return sync.getPosition(url)
}

export async function setSavedPage (page) {
    await local.set(page)

    const options = await getOptions()
    if (options.hybrid && !canRetrySync()) {
        await localSaved.set(page)
        return { syncSaved: false, hybrid: true, deferred: true }
    }

    try {
        await sync.set(page)
        syncRetryAfter = 0
        if (options.hybrid) {
            await localSaved.remove(page.url)
            await rebalanceHybridStorage()
        }
        return { syncSaved: true, hybrid: options.hybrid }
    } catch (error) {
        deferSyncRetry(error)
        await localSaved.set(page)
        try {
            await sync.remove(page.url)
        } catch (removeError) {
            console.warn(
                'Read Later: unable to remove stale synced page.',
                removeError
            )
        }
        if (!options.hybrid) await useHybridStorage()
        if (!isSyncLimitError(error)) {
            console.warn('Read Later: page saved as local overflow.', error)
        }
        return { syncSaved: false, hybrid: true, error }
    }
}

export async function useHybridStorage () {
    const options = await getOptions()
    await local.set({
        options: {
            ...options,
            hybrid:    true,
            isOptions: true,
        },
    })
}

export async function isSyncNearQuota () {
    const bytes = await sync.getBytesInUse(null)
    return bytes >= chrome.storage.sync.QUOTA_BYTES * 0.9
}

export async function isSyncFull () {
    const bytes = await sync.getBytesInUse(null)
    const items = await sync.get()
    return bytes >= chrome.storage.sync.QUOTA_BYTES * 0.99
        || Object.keys(items).length >= chrome.storage.sync.MAX_ITEMS
}

export async function getSyncCapacity () {
    const items = await sync.get()
    const keys = Object.keys(items)
    const pageKeys = keys.filter(key => items[key]?.url)
    const bytesUsed = await sync.getBytesInUse(null)
    const pageBytes = pageKeys.length
        ? await sync.getBytesInUse(pageKeys)
        : 0
    const averagePageBytes = pageKeys.length
        ? pageBytes / pageKeys.length
        : 0
    const remainingBytes = Math.max(
        0,
        chrome.storage.sync.QUOTA_BYTES - bytesUsed
    )
    const remainingByBytes = averagePageBytes
        ? Math.floor(remainingBytes / averagePageBytes)
        : Infinity
    const remainingByCount = Math.max(
        0,
        chrome.storage.sync.MAX_ITEMS - keys.length
    )
    const remainingItems = Math.max(
        0,
        Math.min(remainingByBytes, remainingByCount)
    )

    return {
        isNearQuota: bytesUsed >= chrome.storage.sync.QUOTA_BYTES * 0.9
            || remainingItems <= 20,
        remainingItems,
    }
}

export async function getLocalOverflowCount () {
    return (await getLocalOverflowUrls()).length
}

export async function getLocalOverflowUrls () {
    const localPages = await localSaved.sortByLatest()
    const syncPages = await sync.sortByLatest()
    const syncUrls = new Set(syncPages.map(page => page.url))
    return localPages
        .filter(page => !syncUrls.has(page.url))
        .map(page => page.url)
}

export async function removeHybridSavedPage (url) {
    await Promise.all([
        localSaved.remove(url),
        sync.remove(url),
    ])
}

export async function rebalanceHybridStorage () {
    if (rebalancePromise) return rebalancePromise

    rebalancePromise = promoteLocalOverflow()
    try {
        return await rebalancePromise
    } finally {
        rebalancePromise = undefined
    }
}

async function promoteLocalOverflow () {
    const options = await getOptions()
    if (!options.hybrid || !canRetrySync()) return

    const pages = (await localSaved.sortByLatest()).reverse()
    for (const page of pages) {
        try {
            await sync.set(page)
            syncRetryAfter = 0
            await localSaved.remove(page.url)
        } catch (error) {
            deferSyncRetry(error)
            if (!isSyncLimitError(error)) {
                console.warn('Read Later: local overflow sync failed.', error)
            }
            break
        }
    }
}

export function onSyncChanged (callback) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync') {
            syncRetryAfter = 0
            callback(changes)
        }
    })
}

async function copyLocalSavedPagesToSync () {
    const pages = await localSaved.sortByLatest()
    if (pages.length) {
        await sync.set(Object.fromEntries(
            pages.map(page => [page.url, page])
        ))
        await localSaved.clear()
    }
}
