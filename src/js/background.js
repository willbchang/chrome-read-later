import "./prototype.js";
import * as storage from "./storage.js";
import * as tabs from "./tabs.js";
import * as page from "./page.js";
import * as event from "./event.js";

event.setContextMenus();

event.onCommand(() => {
  tabs.current(aTab => {
    if (aTab.isEmpty()) return;
    storage.uniqueSet(tabs.get(aTab));
    tabs.set(aTab.id)
  });
});

event.onClicked((info, tab) => {
  storage.uniqueSet(page.get(info, tab));
});
