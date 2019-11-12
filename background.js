import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'
// https://stackoverflow.com/questions/28250680/how-do-i-access-previous-promise-results-in-a-then-chain
extension.onCommand(() => {
  let tab
  tabs
    .current()
    .then(aTab => {
      if (tabs.isEmpty(aTab)) return
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
  if (!message.url) return
  tabs
    .current()
    .then(tab => {
      if (tabs.isEmpty(tab)) return tabs.update(message.url)
      return tabs.create(message.url)
    })
    .then(storage.get)
    .then(pages => {
      setPosition(pages)
      storage.remove(message.url)
    })

  function setPosition(pages) {
    const page = pages[message.url]
    const position = {}
    position.scrollTop = page.scrollTop

    tabs.onComplete(tabId => {
      // Use raw sendMessage to avoid receive response.
      // Which will cause message port closed before sending.
      chrome.tabs.sendMessage(tabId, position)
    })
  }
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
