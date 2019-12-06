import * as extension from '../modules/extension.mjs'
import * as page from '../modules/page.mjs'
import * as storage from '../modules/storage.mjs'

extension.onCommand(page.get)

extension.onMessage(page.set)

extension.onClickedContextMenus(async (selection, tab) => {
  selection.linkUrl
    ? storage.set(page.getInfo({tab, ...selection}))
    : await page.get()
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link', 'page'],
    id: 'read-later',
  })
})

