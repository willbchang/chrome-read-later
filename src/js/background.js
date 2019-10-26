import "./prototype.js";
import * as storage from "./storage.js";
import * as tabs from "./tabs.js";
import * as page from "./page.js";

function updateTab(id) {
  tabs.all(aTabs => {
    aTabs.length === 1 ? tabs.stayEmpty(id) : tabs.remove(id)
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
      updateTab(aTab.id)
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'read-later') return;
  storage.uniqueSet(page.get(info, tab));
});
