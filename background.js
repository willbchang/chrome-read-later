import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'

extension.onCommand(async () => {
  const tab = await tabs.current()
  if (tabs.isEmpty(tab)) return

  const position = await tabs.sendMessage(tab.id, { info: 'get page position' })
  storage.setPage(tab, position)

  const allTabs = await tabs.query({})
  allTabs.length === 1 ? tabs.empty(tab) : tabs.remove(tab)
})

extension.onMessage(async message => {
  const tab = await tabs.current()
  tabs.isEmpty(tab) ? tabs.update(message.url) : tabs.create(message.url)

  const tabId = await tabs.onComplete()
  const position = await storage.getPosition(message.url)
  chrome.tabs.sendMessage(tabId, position)

  storage.remove(message.url)
})

extension.onClicked((selection, tab) => {
  storage.setSelection(tab, selection)
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  })
})
