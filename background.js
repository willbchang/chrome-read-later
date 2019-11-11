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
    tabs.sendMessage(tab.id, { info: 'get page position' }, position => {
      storage.setPage(tab, position)
      tabs.emptyOrRemove(tab)
    })
  })
})

extension.onMessage(request => {
  if (!request.url) return
  storage.get(pages => {
    const page = pages[request.url]
    const position = {}
    position.scrollTop = page.scrollTop
    tabs.openInCurrentOrNewTab(request.url, position)
    storage.remove(request.url)
  })
})

extension.onClicked((selection, tab) => {
  storage.setSelection(tab, selection)
})
