import '../modules/tab.prototype.js'
import * as extension from '../modules/extension.js'
import * as storage from '../modules/storage.js'
import * as tabs from '../modules/tabs.js'

extension.onCommand(async () => {
  const tab = await tabs.queryCurrent()
  if (tab.isEmpty()) return
  else if (!tab.isHttp()) storage.setPage(tab)
  else if (!tab.isComplete()) storage.setPage(tab)
  else {
    const position = await tabs.sendMessage(tab.id, { info: 'get position' })
    storage.setPage(tab, position)
  }

  const allTabs = await tabs.queryAll()
  allTabs.length === 1 ? tabs.empty() : tabs.remove(tab)
})

extension.onMessage(async message => {
  const tab = await tabs.queryCurrent()
  tab.isEmpty() ? await tabs.update(message.url) : await tabs.create(message.url)

  const position = await storage.getPosition(message.url)
  storage.remove(message.url)
  if (!position.scrollTop) return

  // Use raw sendMessage to avoid the error message below:
  // The message port closed before a response was received.
  const tabId = await tabs.onComplete()
  chrome.tabs.sendMessage(tabId, position)
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
