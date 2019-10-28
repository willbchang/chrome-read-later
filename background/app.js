import "../modules/tab.prototype.js"
import * as storage from "../modules/storage.js"
import * as tabs from "../modules/tabs.js"
import * as page from "../modules/page.js"
import * as extension from "../modules/extension.js"

extension.setContextMenus()

extension.onCommand(() => {
  tabs.current(tab => {
    if (tab.isEmpty()) return
    storage.setUnique(tab.getInfo())
    tab.setEmptyOrRemove()
  })
})

extension.onClicked((info, tab) => {
  storage.setUnique(page.get(info, tab))
})
