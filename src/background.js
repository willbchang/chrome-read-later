import * as data from '../modules/data.mjs'
import * as extension from '../modules/extension.mjs'
import * as storage from '../modules/storage.mjs'
import * as tabs from '../modules/tabs.mjs'

extension.onCommand(async () => {
  // It will only set the tab info if position is undefined.
  // Runs smoothly even if it's offline, chrome://*, etc.
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  storage.set(data.getPage({tab, position}))

  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
})

extension.onMessage(async message => {
  await tabs.isEmptyTab() ? await tabs.update(message.url) : await tabs.create(message.url)

  const position = await storage.getPosition(message.url)
  storage.remove(message.url)

  const tabId = await tabs.onComplete()
  await tabs.sendMessage(tabId, position)
})

extension.onClicked((selection, tab) => {
  storage.set(data.getPage({tab, selection}))
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  })
})
