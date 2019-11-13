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

extension.onMessage(message => {
  let tabId
  tabs
    .current()
    .then(tab => {
      if (tabs.isEmpty(tab)) return tabs.update(message.url)
      return tabs.create(message.url)
    })
    .then(tabs.onComplete)
    .then(aTabId => {
      tabId = aTabId
      return storage.getPosition(message.url)
    })
    .then(position => {
      // Use raw sendMessage to avoid receive response.
      // Which will cause message port closed before sending.
      chrome.tabs.sendMessage(tabId, position)
    })
    .then(() => storage.remove(message.url))
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
