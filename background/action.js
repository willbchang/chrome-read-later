import * as data from './pageInfo.js'
import * as storage from '../modules/chrome/storage.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'

export async function saveSelection (tab, selection) {
    await updateStorage({ tab, selection })
}

async function updateStorage ({ tab, position = {}, selection = {} }) {
    let page = data.initPageInfo({ tab, position, selection })
    await storage.sync.set(page)
    await storage.local.set(page)

    if (!page.url.isHttp()) return
    page = await data.completePageInfo(page)
    await storage.sync.set(page)
    await storage.local.set(page)
}

export async function savePage () {
    const tab = await tabs.queryCurrent()
    const position = await tabs.sendMessage(tab.id, { info: 'get position' })
    const { options } = await storage.sync.get('options')

    if (options?.keepSavedTab) {
        chrome.action.setBadgeText({ text: 'done' })
        setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1500)
    } else {
        await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
    }

    await updateStorage({ tab, position })
}

export async function openPage ({ url, currentTab, active, isHistory }) {
    const tab = currentTab ? await tabs.update(url) : await tabs.create(url,
        active)
    const position = isHistory
        ? await storage.local.getPosition(url)
        : await storage.sync.getPosition(url)
    const tabId = await tabs.onComplete(tab)
    await tabs.sendMessage(tabId, { ...position, info: 'set position' })
}

export function removeDeletePages () {
    storage.session.getArray('deletedLocalUrls').
        then(data => data.forEach(url => storage.local.remove(url)))
    storage.session.getArray('deletedSyncUrls').
        then(data => data.forEach(url => storage.sync.remove(url)))
    storage.session.remove('deletedLocalUrls')
    storage.session.remove('deletedSyncUrls')
}

export async function migrateStorage () {
    storage.local.clear()
    const pages = await storage.sync.get()
    for (const url of Object.keys(pages)) {
        await storage.local.set(pages[url])
    }
}
