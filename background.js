import "./modules/tab.prototype.js"
import * as storage from "./modules/storage.js"
import * as tabs from "./modules/tabs.js"
import * as page from "./modules/page.js"
import * as extension from "./modules/extension.js"

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
