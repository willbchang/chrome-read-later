import "./prototype.js";
import * as storage from "./storage.js";
import * as tabs from "./tabs.js";
import * as page from "./page.js";

const final = function updateToNewTabForFinalTab(id, newTab) {
  tabs.all(aTabs => {
    aTabs.length === 1 ? tabs.update(id, newTab) : tabs.remove(id);
  });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  });
});

chrome.commands.onCommand.addListener(command => {
  if (command === 'read-later') {
    tabs.current(aTab => {
      if (aTab.isEmpty()) return;
      storage.uniqueSet(tabs.get(aTab));
      final(aTab.id, 'chrome://newtab/');
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'read-later') return;
  storage.uniqueSet(page.get(info, tab));
});
