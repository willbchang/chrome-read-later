import './modules/tab.prototype.js'
import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'
import * as extension from './modules/extension.js'

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  })
})

extension.onCommand(() => {
  tabs.current(tab => {
    if (tab.isEmpty()) return
    tabs.sendMessage(tab, { info: 'save' }, position => {
      storage.setPage(tab, position)
      tab.setEmptyOrRemove()
    })
  })
})

extension.onClicked((selection, tab) => {
  storage.setSelection(tab, selection)
})
