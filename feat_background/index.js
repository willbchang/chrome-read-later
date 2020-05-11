import * as commands from '../modules_chrome/commands.mjs'
import * as contextMenus from '../modules_chrome/contextMenus.mjs'
import * as runtime from '../modules_chrome/runtime.mjs'
import * as tabs from '../modules_chrome/tabs.mjs'
import * as action from './action.js'

commands.onCommand(action.savePage)
runtime.onMessage(action.openPage)

contextMenus.onClicked(async (selection, tab) => {
  selection.linkUrl ? await action.saveSelection(tab, selection) : await action.savePage()
})

contextMenus.create({
  title:    'Read later',
  contexts: ['all'],
  id:       'read-later',
})

runtime.onInstalled(() =>
  tabs.create('https://github.com/willbchang/chrome-read-later#usages'))

