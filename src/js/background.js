import * as storage from "./storage.js";
import * as tabs from "./tabs.js";
import * as page from "./page.js";


const tab = function getCurrentTab() {
  tabs.current(aTab => {
    if (aTab.url === 'chrome://newtab/') return;
    storage.uniqueSet(tabs.get(aTab));
    final(aTab.id, 'chrome://newtab/');
  });
};

const final = function updateToNewTabForFinalTab(id, newTab) {
  tabs.all(aTabs => {
    if (aTabs.length === 1) {
      chrome.tabs.update(id, { url: newTab });
    } else {
      close(id);
    }
  });
};


const close = function closeCurrentTab(id) {
  chrome.tabs.remove(id);
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Read later',
    contexts: ['link'],
    id: 'read-later',
  });
});

chrome.commands.onCommand.addListener(command => {
  if (command === 'read-later') tab();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'read-later') return;
  storage.uniqueSet(page.get(info, tab));
});
