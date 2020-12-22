import '../../modules/prototypes/localStorage.mjs'
import * as commands from '../../modules/chrome/commands.mjs'
import * as contextMenus from '../../modules/chrome/contextMenus.mjs'
import * as runtime from '../../modules/chrome/runtime.mjs'
import * as tabs from '../../modules/chrome/tabs.mjs'
import * as action from './action.js'
import * as storage from '../../modules/chrome/storage.mjs'

commands.onCommand(action.savePage)
runtime.onMessage(action.openPage)
runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(async function () {
    for (const url of localStorage.getArray('deletedLocalUrls')) {
      await storage.local.removeHistory(url)
    }
    localStorage.removeItem('deletedLocalUrls')
    localStorage.getArray('deletedSyncUrls').forEach(storage.sync.remove)
    localStorage.removeItem('deletedSyncUrls')
  })
})

contextMenus.onClicked(async (selection, tab) => {
  selection.linkUrl ? await action.saveSelection(tab, selection) : await action.savePage()
})

contextMenus.create({
  title:    'Read later',
  contexts: ['all'],
  id:       'chrome-read-later.willbc.cn',
})

runtime.onInstalled(() =>
  tabs.create('https://github.com/willbchang/chrome-read-later#usages'))

