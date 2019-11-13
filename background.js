import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'

// Use Promise for onCommand listener will cause only listen once.
extension.onCommand(() => {
  // https://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain
  // I choose to use variable to maintain code readability.
  let tab
  tabs
    .current()
    .then(aTab => {
      tab = aTab
      // Break the promise chain when the tab is empty.
      // https://stackoverflow.com/a/45339587/9984029
      if (tabs.isEmpty(tab)) return { then: () => {} }
      return tabs.sendMessage(tab.id, { info: 'get page position' })
    })
    .then(position => {
      storage.setPage(tab, position)
      return tabs.query({})
    })
    .then(allTabs => {
      allTabs.length === 1 ? tabs.empty(tab) : tabs.remove(tab)
    })
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
