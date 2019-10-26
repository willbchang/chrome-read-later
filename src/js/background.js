import * as storage from "./storage.js";
import * as tabs from "./tabs.js";
import * as page from "./page.js";
import * as event from "./event.js";

event.setContextMenus();

event.onCommand(() => {
  tabs.current(tab => {
    if (tabs.isEmpty(tab)) return;
    storage.uniqueSet(tabs.get(tab));
    tabs.set(tab)
  });
});

event.onClicked((info, tab) => {
  storage.uniqueSet(page.get(info, tab));
});
