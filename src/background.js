import * as extension from '../modules/extension.mjs'
import * as storage from '../modules/storage.mjs'
import * as tabs from '../modules/tabs.mjs'

extension.onCommand(async () => {
  // It will only set the tab info if position is undefined.
  // Runs smoothly even if it's offline, chrome://*, etc.
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  storage.setPageInfo({tab, position})

  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
})

extension.onMessage(async ({url}) => {
  const newTab = await tabs.isEmptyTab()
    ? await tabs.update(url)
    : await tabs.create(url)

  const position = await storage.getPagePosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(newTab)
  await tabs.sendMessage(tabId, position)
})

extension.onClickedContextMenus((selection, tab) => {
  storage.setPageInfo({tab, selection})
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link', 'page'],
    id: 'read-later',
  })
})
