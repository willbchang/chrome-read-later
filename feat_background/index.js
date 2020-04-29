import * as data from './pageInfo.mjs'
import * as commands from '../modules_chrome/commands.mjs'
import * as contextMenus from '../modules_chrome/contextMenus.mjs'
import * as runtime from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as tabs from '../modules_chrome/tabs.mjs'

commands.onCommand(savePage)
runtime.onMessage(openPage)

contextMenus.onClicked(async (selection, tab) => {
  selection.linkUrl ? await saveSelection(tab, selection) : await savePage()
})

contextMenus.create({
  title: 'Read later',
  contexts: ['all'],
  id: 'read-later',
})

runtime.onInstalled(() => tabs.create('https://github.com/willbchang/chrome-read-later#usages'))

async function savePage() {
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

async function openPage({url, currentTab, active}) {
  const tab = currentTab ? await tabs.update(url) : await tabs.create(url, active)

  const position = await storage.getScrollPosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(tab)
  await tabs.sendMessage(tabId, {...position, info: 'set position'})
}

async function saveSelection(tab, selection) {
  await updateStorage({tab, selection})
}

