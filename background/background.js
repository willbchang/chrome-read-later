import '../modules/prototypes/localStorage.mjs'
import * as commands from '../modules/chrome/commands.mjs'
import * as contextMenus from '../modules/chrome/contextMenus.mjs'
import * as runtime from '../modules/chrome/runtime.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'
import * as action from './action.js'

commands.onCommand(action.savePage)
runtime.onMessage(action.openPage)
runtime.onPopupDisconnect(action.removeDeletePages)

contextMenus.onClicked(async (selection, tab) => {
    selection.linkUrl ? await action.saveSelection(tab, selection) : await action.savePage()
})

contextMenus.create({
    title:    'Save to Read later',
    contexts: ['all'],
    id:       'chrome-read-later.willbc.cn',
})

runtime.onInstall(async () => {
    await tabs.create('https://github.com/willbchang/chrome-read-later#readme')
})

runtime.onUpdate(async details => {
    if (details.previousVersion[0] < '5' && runtime.getCurrentVersion() > '5.0.0') {
        await action.migrateStorage()
    }
})
