import * as data from '../modules/data.mjs'
import * as extension from '../modules/extension.mjs'
import * as storage from '../modules/storage.mjs'
import * as tabs from '../modules/tabs.mjs'

extension.onCommand(async () => {
  const tab = await tabs.queryCurrent()
  if (tabs.isEmpty(tab)) return

  // It will only set the tab info if position is undefined.
  // Runs smoothly even if it's offline, chrome://*, etc.
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  storage.set(data.extractJson({tab, position}))

  const allTabs = await tabs.queryAll()
  allTabs.length === 1 ? tabs.empty() : tabs.remove(tab)
})

extension.onMessage(async message => {
  const tab = await tabs.queryCurrent()
  tabs.isEmpty(tab) ? await tabs.update(message.url) : await tabs.create(message.url)

  const position = await storage.getPosition(message.url)
  storage.remove(message.url)

  const tabId = await tabs.onComplete()
  await tabs.sendMessage(tabId, position)
})

extension.onClicked((selection, tab) => {
  storage.set(data.extractJson({tab, selection}))
})

extension.onInstalled(() => {
  extension.createContextMenus({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  })
})
