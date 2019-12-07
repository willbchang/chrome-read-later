import * as data from '../modules/data.mjs'
import * as extension from '../modules/extension.mjs'
import * as storage from '../modules/storage.mjs'
import * as tabs from '../modules/tabs.mjs'

extension.onCommand(savePage)
extension.onMessage(openPage)

extension.onClickedContextMenus(async (selection, tab) => {
  selection.linkUrl ? saveSelection(tab, selection) : await savePage()
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link', 'page'],
    id: 'read-later',
  })
})

export async function savePage() {
  // It will only set the tab info if position is undefined.
  // Runs smoothly even if it's offline, chrome://*, etc.
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  console.log(data.getInfo({tab, position}))
  storage.set(data.getInfo({tab, position}))

  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
}

export function saveSelection(tab, selection) {
  storage.set(data.getInfo({tab, ...selection}))
}

export async function openPage({url}) {
  console.log(url)
  const newTab = await tabs.isEmptyTab()
    ? await tabs.update(url)
    : await tabs.create(url)

  const position = await storage.getScrollPosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(newTab)
  await tabs.sendMessage(tabId, position)
}
