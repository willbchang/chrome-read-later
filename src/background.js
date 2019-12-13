import {createPageData} from '../modules/data.mjs'
import * as commands from '../modules_chrome/commands.mjs'
import * as contextMenus from '../modules_chrome/contextMenus.mjs'
import * as runtime from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as tabs from '../modules_chrome/tabs.mjs'

commands.onCommand(savePage)
runtime.onMessage(openPage)

contextMenus.onClicked(async (selection, tab) => {
  selection.linkUrl ? saveSelection(tab, selection) : await savePage()
})

runtime.onInstalled(() => {
  contextMenus.create({
    title: 'Read later',
    contexts: ['link', 'page'],
    id: 'read-later',
  })
})

export async function savePage() {
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})

  const page = createPageData({tab, position})
  storage.set(page)

  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
}

export function saveSelection(tab, selection) {
  const page = createPageData({tab, selection})
  storage.set(page)
}

export async function openPage({url}) {
  const newTab = await tabs.isEmptyTab()
    ? await tabs.update(url)
    : await tabs.create(url)

  const position = await storage.getScrollPosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(newTab)
  await tabs.sendMessage(tabId, {...position, info: 'set position'})
}
