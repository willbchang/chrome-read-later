import { beforeAll, beforeEach, describe, expect, test } from 'bun:test'

/* global globalThis */

const clone = value => JSON.parse(JSON.stringify(value))

const createStorageArea = (initialData = {}) => {
    let data = clone(initialData)
    let nextError
    let quotaBytes = Infinity
    let setCalls = 0

    return {
        failNextSet (message = 'QUOTA_BYTES quota exceeded') {
            nextError = message
        },
        fillQuota () {
            quotaBytes = JSON.stringify(data).length
        },
        resetQuota () {
            quotaBytes = Infinity
        },
        getSetCalls () {
            return setCalls
        },
        resetSetCalls () {
            setCalls = 0
        },
        get (key, callback) {
            if (key === undefined || key === null) {
                callback(clone(data))
                return
            }

            const keys = Array.isArray(key) ? key : [key]
            callback(Object.fromEntries(
                keys.filter(value => value in data)
                    .map(value => [value, clone(data[value])])
            ))
        },
        set (value, callback) {
            setCalls++
            if (nextError) {
                chrome.runtime.lastError = { message: nextError }
                nextError = undefined
                callback()
                delete chrome.runtime.lastError
                return
            }

            const nextData = { ...data, ...clone(value) }
            if (JSON.stringify(nextData).length > quotaBytes) {
                chrome.runtime.lastError = {
                    message: 'QUOTA_BYTES quota exceeded',
                }
                callback()
                delete chrome.runtime.lastError
                return
            }

            data = nextData
            callback()
        },
        remove (key, callback) {
            const keys = Array.isArray(key) ? key : [key]
            keys.forEach(value => delete data[value])
            callback()
        },
        clear (callback) {
            data = {}
            callback()
        },
        getBytesInUse (key, callback) {
            callback(JSON.stringify(data).length)
        },
    }
}

const page = (url, date) => ({
    url,
    date,
    title:      url,
    scroll:     { top: 0, height: 0 },
    video:      { currentTime: 0, playbackRate: 1 },
    favIconUrl: '',
})

const syncArea = createStorageArea()
syncArea.QUOTA_BYTES = 102400
syncArea.MAX_ITEMS = 512
const localArea = createStorageArea()
const sessionArea = createStorageArea()

globalThis.chrome = {
    runtime: {},
    storage: {
        sync:    syncArea,
        local:   localArea,
        session: sessionArea,
    },
}

let storage

beforeAll(async () => {
    storage = await import('./storage.mjs')
})

beforeEach(async () => {
    syncArea.resetQuota()
    syncArea.QUOTA_BYTES = 102400
    syncArea.MAX_ITEMS = 512
    await storage.sync.clear()
    await storage.local.clear()
    await storage.localSaved.clear()
    syncArea.resetSetCalls()
})

describe('hybrid reading list storage', () => {
    test('enables item popovers and history by default', async () => {
        const options = await storage.getOptions()

        expect(options.itemPopover).toBe(true)
        expect(options.historyMode).toBe(true)
        expect(options.historyRetentionDays).toBe(0)
    })

    test('does not record new history when history mode is disabled', async () => {
        await storage.setOptions({ historyMode: false })

        await storage.setSavedPage(page('https://no-history.example', 1))

        expect(await storage.sync.sortByLatest()).toHaveLength(1)
        expect(await storage.local.sortByLatest()).toHaveLength(0)
    })

    test('keeps only the latest history items', async () => {
        const historyPages = Object.fromEntries(
            Array.from({ length: storage.HISTORY_ITEM_LIMIT }, (_, index) => {
                const savedPage = page(`https://history-${index}.example`, index)
                return [savedPage.url, savedPage]
            })
        )
        await storage.local.set(historyPages)

        await storage.setSavedPage(page(
            'https://new-history.example',
            storage.HISTORY_ITEM_LIMIT + 1
        ))

        const history = await storage.local.sortByLatest()
        expect(history).toHaveLength(storage.HISTORY_ITEM_LIMIT)
        expect(history[0].url).toBe('https://new-history.example')
        expect(
            history.some(item => item.url === 'https://history-0.example')
        ).toBe(false)
    })

    test('updates existing history without removing another item', async () => {
        const historyPages = Object.fromEntries(
            Array.from({ length: storage.HISTORY_ITEM_LIMIT }, (_, index) => {
                const savedPage = page(`https://history-${index}.example`, index)
                return [savedPage.url, savedPage]
            })
        )
        await storage.local.set(historyPages)

        await storage.setSavedPage(page(
            'https://history-0.example',
            storage.HISTORY_ITEM_LIMIT + 1
        ))

        const history = await storage.local.sortByLatest()
        expect(history).toHaveLength(storage.HISTORY_ITEM_LIMIT)
        expect(history[0].url).toBe('https://history-0.example')
    })

    test('cleans up excess history without removing local overflow', async () => {
        const pages = Object.fromEntries(
            Array.from({ length: storage.HISTORY_ITEM_LIMIT + 1 }, (_, index) => {
                const savedPage = page(`https://history-${index}.example`, index)
                return [savedPage.url, savedPage]
            })
        )
        await storage.local.set(pages)
        await storage.localSaved.set(page('https://overflow.example', 1000))

        expect(await storage.cleanupHistory()).toBe(1)

        expect(await storage.local.sortByLatest()).toHaveLength(
            storage.HISTORY_ITEM_LIMIT
        )
        expect(await storage.localSaved.sortByLatest()).toHaveLength(1)
    })

    test('applies a selected time range immediately and locally', async () => {
        const now = Date.now()
        const day = 24 * 60 * 60 * 1000
        await storage.local.set(page('https://old-history.example', now - 31 * day))
        await storage.local.set(page('https://recent-history.example', now - 29 * day))

        await storage.setOptions({ historyRetentionDays: 30 })

        expect((await storage.local.sortByLatest()).map(item => item.url)).toEqual([
            'https://recent-history.example',
        ])
        expect((await storage.local.get('options')).options.historyRetentionDays).toBe(30)
        expect(
            (await storage.sync.get('options')).options.historyRetentionDays
        ).toBeUndefined()
    })

    test('applies the time range before saving new history', async () => {
        const day = 24 * 60 * 60 * 1000
        await storage.setOptions({ historyRetentionDays: 7 })
        await storage.local.set(page(
            'https://old-history.example',
            Date.now() - 8 * day
        ))

        await storage.setSavedPage(page('https://new-history.example', Date.now()))

        expect((await storage.local.sortByLatest()).map(item => item.url)).toEqual([
            'https://new-history.example',
        ])
    })

    test('shows the union of synced and local overflow items', async () => {
        await storage.sync.set(page('https://synced.example', 2))
        await storage.local.set(page('https://history.example', 1))
        await storage.localSaved.set(page('https://local.example', 3))

        const result = await storage.setOptions({ hybrid: true })

        expect(result.error).toBeUndefined()
        expect((await storage.sortSavedByLatest()).map(item => item.url)).toEqual([
            'https://local.example',
            'https://synced.example',
        ])
        expect((await storage.local.sortByLatest()).map(item => item.url)).toEqual([
            'https://history.example',
        ])
    })

    test('deduplicates pages that exist in both active stores', async () => {
        await storage.sync.set(page('https://same.example', 1))
        await storage.localSaved.set(page('https://same.example', 2))
        await storage.setOptions({ hybrid: true })

        const pages = await storage.sortSavedByLatest()

        expect(pages).toHaveLength(1)
        expect(pages[0].date).toBe(2)
    })

    test('falls back without losing the page when Chrome sync is full', async () => {
        await storage.sync.set(page('https://synced.example', 1))
        syncArea.fillQuota()

        const result = await storage.setSavedPage(page('https://new.example', 2))

        expect(result.error?.message).toContain('quota exceeded')
        expect((await storage.getOptions()).hybrid).toBe(true)
        expect((await storage.localSaved.sortByLatest()).map(item => item.url)).toEqual([
            'https://new.example',
        ])
        expect((await storage.sortSavedByLatest()).map(item => item.url)).toEqual([
            'https://new.example',
            'https://synced.example',
        ])
    })

    test('continues trying sync and removes a local duplicate on success', async () => {
        const savedPage = page('https://local.example', 1)
        await storage.localSaved.set(savedPage)
        await storage.setOptions({ hybrid: true })

        const result = await storage.setSavedPage(page(savedPage.url, 2))

        expect(result.syncSaved).toBe(true)
        expect(await storage.sync.sortByLatest()).toHaveLength(1)
        expect(await storage.localSaved.sortByLatest()).toHaveLength(0)
    })

    test('makes overflow authoritative when updating a synced page fails', async () => {
        const url = 'https://updated.example'
        await storage.sync.set(page(url, 1))
        syncArea.failNextSet()

        await storage.setSavedPage(page(url, 2))

        expect(await storage.sync.sortByLatest()).toHaveLength(0)
        expect((await storage.localSaved.sortByLatest())[0].date).toBe(2)
    })

    test('reports when Chrome sync storage is full', async () => {
        await storage.sync.set(page('https://synced.example', 1))
        syncArea.QUOTA_BYTES = 1

        expect(await storage.isSyncFull()).toBe(true)
    })

    test('estimates how many sync items remain', async () => {
        await storage.sync.set(page('https://one.example', 1))
        await storage.sync.set(page('https://two.example', 2))
        await storage.sync.set(page('https://three.example', 3))
        syncArea.MAX_ITEMS = 10

        const capacity = await storage.getSyncCapacity()

        expect(capacity.remainingItems).toBe(7)
        expect(capacity.isNearQuota).toBe(true)
    })

    test('counts only local overflow items', async () => {
        await storage.sync.set(page('https://synced.example', 1))
        await storage.localSaved.set(page('https://synced.example', 1))
        await storage.localSaved.set(page('https://local-one.example', 2))
        await storage.localSaved.set(page('https://local-two.example', 3))

        expect(await storage.getLocalOverflowCount()).toBe(2)
    })

    test('removes hybrid items from both active stores', async () => {
        const savedPage = page('https://synced.example', 1)
        await storage.sync.set(savedPage)
        await storage.local.set(savedPage)
        await storage.localSaved.set(savedPage)

        await storage.removeHybridSavedPage(savedPage.url)

        expect(await storage.sync.sortByLatest()).toHaveLength(0)
        expect(await storage.localSaved.sortByLatest()).toHaveLength(0)
        expect(await storage.local.sortByLatest()).toHaveLength(1)
    })

    test('keeps hybrid mode enabled when overflow does not fit in sync', async () => {
        await storage.setOptions({ hybrid: true })
        await storage.localSaved.set(page('https://local.example', 1))
        syncArea.failNextSet()

        const result = await storage.setOptions({ hybrid: false })

        expect(result.error?.message).toContain('quota exceeded')
        expect(result.options.hybrid).toBe(true)
        expect((await storage.getOptions()).hybrid).toBe(true)
    })

    test('moves overflow to sync when hybrid mode is disabled', async () => {
        await storage.setOptions({ hybrid: true })
        await storage.localSaved.set(page('https://local.example', 1))

        const result = await storage.setOptions({ hybrid: false })

        expect(result.error).toBeUndefined()
        expect(result.options.hybrid).toBe(false)
        expect(await storage.sync.sortByLatest()).toHaveLength(1)
        expect(await storage.localSaved.sortByLatest()).toHaveLength(0)
    })

    test('promotes local overflow after sync space is freed', async () => {
        await storage.setOptions({ hybrid: true })
        await storage.localSaved.set(page('https://local.example', 1))

        await storage.rebalanceHybridStorage()

        expect(await storage.sync.sortByLatest()).toHaveLength(1)
        expect(await storage.localSaved.sortByLatest()).toHaveLength(0)
    })

    test('promotes existing overflow before saving a new page', async () => {
        await storage.setOptions({ hybrid: true })
        await storage.localSaved.set(page('https://local.example', 1))

        await storage.setSavedPage(page('https://new.example', 2))

        expect((await storage.sync.sortByLatest()).map(item => item.url)).toEqual([
            'https://new.example',
            'https://local.example',
        ])
        expect(await storage.localSaved.sortByLatest()).toHaveLength(0)
    })

    test('stops promotion after the first total-quota failure', async () => {
        await storage.setOptions({ hybrid: true })
        await storage.localSaved.set(page('https://local-one.example', 1))
        await storage.localSaved.set(page('https://local-two.example', 2))
        syncArea.fillQuota()
        syncArea.resetSetCalls()

        await storage.rebalanceHybridStorage()

        expect(syncArea.getSetCalls()).toBe(1)
        expect(await storage.localSaved.sortByLatest()).toHaveLength(2)
    })

    test('defers later sync writes after a quota failure', async () => {
        await storage.setOptions({ hybrid: true })
        syncArea.fillQuota()
        syncArea.resetSetCalls()

        await storage.setSavedPage(page('https://local-one.example', 1))
        const result = await storage.setSavedPage(
            page('https://local-two.example', 2)
        )

        expect(syncArea.getSetCalls()).toBe(1)
        expect(result.deferred).toBe(true)
        expect(await storage.localSaved.sortByLatest()).toHaveLength(2)
    })

    test('migrates the previous local-only option to hybrid mode', async () => {
        await storage.local.set({
            options: { localOnly: true, isOptions: true },
        })

        const options = await storage.getOptions()

        expect(options.hybrid).toBe(true)
        expect(options.localOnly).toBeUndefined()
    })
})
