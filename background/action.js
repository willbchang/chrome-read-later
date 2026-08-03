import * as data from './pageInfo.js'
import * as storage from '../modules/chrome/storage.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'
import * as localStore from '../modules/localStore/localStore.mjs'
import { getSiteFaviconUrl } from '../modules/favicon.mjs'

export async function saveSelection (tab, selection) {
    await updateStorage({ tab, selection })
}

async function updateStorage ({ tab, position = {}, selection = {} }) {
    let page = data.initPageInfo({ tab, position, selection })
    await savePageToStorage(page)

    if (!page.url.isHttp()) return
    page = await data.completePageInfo(page)
    await savePageToStorage(page)
}

async function savePageToStorage (page) {
    await storage.setSavedPage(page)
}

export async function savePage () {
    const tab = await tabs.queryCurrent()
    const position = await tabs.sendMessage(tab.id, { info: 'get position' })
    const options = await storage.getOptions()

    if (options?.keepSavedTab) {
        await chrome.action.setBadgeText({ text: 'done' })
        setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1500)
    } else {
        await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
    }

    await updateStorage({ tab, position })
}

export async function openPage ({ url, currentTab, active, isArchive }) {
    const tab = currentTab ? await tabs.update(url) : await tabs.create(url,
        active)
    const position = isArchive
        ? await storage.local.getPosition(url)
        : await storage.getSavedPosition(url)
    const tabId = await tabs.onComplete(tab)
    await tabs.sendMessage(tabId, { ...position, info: 'set position' })
}

export async function removeDeletePages () {
    const deletedSyncUrls = await localStore.getArray('deletedSyncUrls')
    await Promise.all(
        deletedSyncUrls.map(url => storage.removeHybridSavedPage(url))
    )

    await storage.rebalanceHybridStorage()
    await localStore.clear()
}

export async function migrateStorage () {
    await upgradeStorage('sync')
    await upgradeStorage('local')

    function upgradeFaviconUrl (url) {
        return getSiteFaviconUrl(url)
            || `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`
    }

    async function upgradeStorage (key) {
        const pages = await storage[key].get()
        for (const page of Object.values(pages)) {
            page.favIconUrl = upgradeFaviconUrl(page.url)
            await storage[key].set(page)
        }
    }
}
