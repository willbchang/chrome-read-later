import * as data from './pageInfo.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as tabs from '../modules_chrome/tabs.mjs'

export async function savePage() {
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
  await updateStorage({tab, position})
}

async function updateStorage({tab, position = {}, selection = {}}) {
  let page = data.initPageInfo({tab, position, selection})
  await storage.set(page)

  if (!page.url.isHttp()) return
  page = await data.completePageInfo(page)
  await storage.set(page)
}

export async function openPage({url, currentTab, active}) {
  const tab = currentTab ? await tabs.update(url) : await tabs.create(url, active)

  const position = await storage.getScrollPosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(tab)
  await tabs.sendMessage(tabId, {...position, info: 'set position'})
}

export async function saveSelection(tab, selection) {
  await updateStorage({tab, selection})
}
