import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'

extension.onCommand(() => {
  tabs.current(tab => {
    if (tabs.isEmpty(tab)) return
    tabs.sendMessage(tab.id, { info: 'get page position' }, position => {
      storage.setPage(tab, position)
      tabs.query({}, xTabs => {
        xTabs.length === 1 ? tabs.empty(tab) : tabs.remove(tab)
      })
    })
  })
})

extension.onMessage(message => {
  if (!message.url) return
  storage.get(pages => {
    tabs.current(tab => {
      tabs.isEmpty(tab)
        ? tabs.update(message.url, setPosition)
        : tabs.create(message.url, setPosition)
    })
    storage.remove(message.url)

    function setPosition() {
      const page = pages[message.url]
      const position = {}
      position.scrollTop = page.scrollTop

      tabs.onComplete(tabId => {
        tabs.sendMessage(tabId, position)
      })
    }
  })
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
