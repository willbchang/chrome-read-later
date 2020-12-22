import * as commands from '../../modules/chrome/commands.mjs'
import * as contextMenus from '../../modules/chrome/contextMenus.mjs'
import * as runtime from '../../modules/chrome/runtime.mjs'
import * as tabs from '../../modules/chrome/tabs.mjs'
import * as action from './action.js'

commands.onCommand(action.savePage)
runtime.onMessage(action.openPage)

chrome.runtime.onConnect.addListener(function (externalPort) {
  externalPort.onDisconnect.addListener(function () {
    console.log('onDisconnect')
    // Do stuff that should happen when popup window closes here
  })

  console.log('onConnect')
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

