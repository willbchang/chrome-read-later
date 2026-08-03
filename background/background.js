import * as commands from '../modules/chrome/commands.mjs'
import * as contextMenus from '../modules/chrome/contextMenus.mjs'
import * as runtime from '../modules/chrome/runtime.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'
import * as action from './action.js'
import * as localStore from '../modules/localStore/localStore.mjs'
import * as storage from '../modules/chrome/storage.mjs'

commands.onCommand(action.savePage)
runtime.onMessage(({ message, data }) => {
    const func = {
        'open': () => action.openPage(data),
        'dele': () => localStore.pushToArray(data.key, data.url)
    }[message]

    func && func()
})
runtime.onPopupDisconnect(action.removeDeletePages)
runtime.onStartup(async () => {
    await Promise.all([
        storage.cleanupHistory(),
        storage.rebalanceHybridStorage(),
    ])
})
storage.onSyncChanged(storage.rebalanceHybridStorage)

contextMenus.onClicked(async (selection, tab) => {
    selection.linkUrl
        ? await action.saveSelection(tab, selection)
        : await action.savePage()
})

runtime.onInstalled(details => {
    if (details.reason !== 'install' && details.reason !== 'update') return

    contextMenus.create({
        title:    'Save to Read later',
        contexts: ['all'],
        id:       'chrome-read-later.willbc.com',
    })
})

runtime.onInstall(async () => {
    await tabs.create('https://github.com/willbchang/chrome-read-later#readme')
})

runtime.onUpdate(async details => {
    if (details.previousVersion[0] < '9' && runtime.getCurrentVersion() >
        '8.0.0') {
        await action.migrateStorage()
    }
})
