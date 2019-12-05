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

extension.onMessage(async message => {
  let newTab
  await tabs.isEmptyTab()
    ? newTab = await tabs.update(message.url)
    : newTab = await tabs.create(message.url)

  const position = await storage.getPagePosition(message.url)
  storage.remove(message.url)

  const tabId = await tabs.onComplete(newTab)
  await tabs.sendMessage(tabId, position)
})

extension.onClickedContextMenus((selection, tab) => {
  storage.setPageInfo({tab, selection})
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  })
})
