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
    if (tabs.isEmpty(tab)) return
    tabs.sendMessage(tab, { info: 'save' }, position => {
      storage.setPage(tab, position)
      tabs.emptyOrRemove(tab)
    })
  })
})

extension.onClicked((selection, tab) => {
  storage.setSelection(tab, selection)
})
