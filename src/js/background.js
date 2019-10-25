import * as storage from "./storage.js";
import * as tabs from "./tabs.js";

const tab = function getCurrentTab() {
  tabs.query({ 'active': true, 'currentWindow': true }, aTabs => {
    const url = aTabs[0].url;
    const pageInfo = {
      url: url,
      title: aTabs[0].title || url,
      favIconUrl: aTabs[0].favIconUrl || 'src/images/32x32gray.png',
    }

    if (url === 'chrome://newtab/') return;
    storage.uniqueSet({
      [Date.now()]: { pageInfo }
    });
    final(aTabs[0].id, 'chrome://newtab/');
  });
};

const final = function updateToNewTabForFinalTab(id, newTab) {
  tabs.query({}, aTabs => {
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

const click = function rightClickLinkAddToReadingList(info, tab) {
  const pageInfo = {
    url: info.linkUrl,
    title: info.selectionText || url,
    favIconUrl: tab.favIconUrl || 'src/images/32x32orange.png'
  }

  storage.uniqueSet({
    [Date.now()]: { pageInfo }
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
  if (command === 'read-later') tab();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'read-later') return;
  click(info, tab);
});
