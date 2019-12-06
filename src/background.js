import * as extension from '../modules/extension.mjs'
import * as page from '../modules/page.mjs'

extension.onCommand(page.save)

extension.onMessage(page.open)

extension.onClickedContextMenus(async (selection, tab) => {
  selection.linkUrl ? page.saveSelection(tab, selection) : await page.save()
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link', 'page'],
    id: 'read-later',
  })
})

