import "./modules/tab.prototype.mjs"
import * as storage from "./modules/storage.mjs"
import * as tabs from "./modules/tabs.mjs"
import * as page from "./modules/page.mjs"
import * as extension from "./modules/extension.mjs"

extension.onInstalled(() => {
  extension.createContextMenus({
    title: "Read later",
    contexts: ["link"],
    id: "read-later",
  })
})

extension.onCommand(() => {
  tabs.current(tab => {
    if (tab.isEmpty()) return
    storage.setUnique(tab.getInfo())
    tab.setEmptyOrRemove()
  })
})

extension.onClicked((selection, tab) => {
  storage.setUnique(page.getInfo(selection, tab))
})
