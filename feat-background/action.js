import * as data from './pageInfo.js'
import * as storage from '../modules-chrome/storage.mjs'
import * as tabs from '../modules-chrome/tabs.mjs'
import * as request from './request.js'


export async function saveSelection(tab, selection) {
  await updateStorage({tab, selection})
}


async function updateStorage({tab, position = {}, selection = {}}) {
  let page = data.initPageInfo({tab, position, selection})
  await storage.sync.set(page)

  if (!page.url.isHttp()) return
  page = await data.completePageInfo(page)
  await storage.sync.set(page)

  const favIcons = await storage.local.get()
  if (page.favIconUrl in favIcons) return

  const favIconBase64 = await request.toBase64(page.favIconUrl)
  await storage.local.set(page.favIconUrl, favIconBase64)
}


export async function savePage() {
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
  await updateStorage({tab, position})
}


export async function openPage({url, currentTab, active}) {
  const tab = currentTab ? await tabs.update(url) : await tabs.create(url, active)
  const position = await storage.sync.getScrollPosition(url)
  storage.sync.remove(url)
  const tabId = await tabs.onComplete(tab)
  await tabs.sendMessage(tabId, {...position, info: 'set position'})
}
