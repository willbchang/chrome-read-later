import * as storage from "../modules/storage.js"
import * as tab from "../modules/tab.js"
import * as tabs from "../modules/tabs.js"
import * as page from "../modules/page.js"
import * as event from "../modules/event.js"

event.setContextMenus()

event.onCommand(() => {
  tabs.current(tab => {
    if (tab.isEmpty()) return
    storage.setUnique(tab.getInfo())
    tabs.setEmptyOrRemove(tab)
  })
})

event.onClicked((info, tab) => {
  storage.setUnique(page.get(info, tab))
})
