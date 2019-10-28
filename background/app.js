import * as storage from "../modules/storage.js"
import * as tabs from "../modules/tabs.js"
import * as page from "../modules/page.js"
import * as event from "../modules/event.js"

event.setContextMenus()

event.onCommand(() => {
  tabs.current(tab => {
    if (tabs.isEmpty(tab)) return
    storage.setUnique(tabs.getInfo(tab))
    tabs.setEmptyOrRemove(tab)
  })
})

event.onClicked((info, tab) => {
  storage.setUnique(page.get(info, tab))
})
