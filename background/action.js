import * as data from './pageInfo.js'
import * as storage from '../modules/chrome/storage.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'
import * as localStore from '../modules/localStore/localStore.mjs'

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
        await chrome.action.setBadgeText({ text: 'done' })
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
    localStore.getArray('deletedSyncUrls')
        .then(data => data.map(url => storage.sync.remove(url)))
        .then(() => localStore.getArray('deletedLocalUrls'))
        .then(data => data.map(url => storage.local.remove(url)))
        .then(localStore.clear)

}

export async function migrateStorage () {
    await upgradeStorage('sync')
    await upgradeStorage('local')

    function upgradeFaviconUrl (url) {
        const oldPrefix = 'chrome://favicon/size/16@2x/'
        const newPrefix = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=`
        return url.replace(oldPrefix, newPrefix) + '&size=32'
    }

    async function upgradeStorage (key) {
        const pages = await storage[key].get()
        for (const page of Object.values(pages)) {
            page.favIconUrl = upgradeFaviconUrl(page.favIconUrl)
            await storage[key].set(page)
        }
    }
}
