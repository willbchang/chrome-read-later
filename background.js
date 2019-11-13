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
      // Break the promise chain when the tab is empty.
      // https://stackoverflow.com/a/45339587/9984029
      if (tabs.isEmpty(aTab)) return { then: () => {} }
      tab = aTab
      return tabs.sendMessage(aTab.id, { info: 'get page position' })
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
  tabs
    .current()
    .then(tab => {
      if (tabs.isEmpty(tab)) return tabs.update(message.url)
      return tabs.create(message.url)
    })
    .then(tabs.onComplete)
    .then(tabId => {
      localStorage.setItem('tabId', tabId)
      return storage.get()
    })
    .then(pages => {
      const page = pages[message.url]
      const position = {}
      position.scrollTop = page.scrollTop
      const tabId = parseInt(localStorage.getItem('tabId'))
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
