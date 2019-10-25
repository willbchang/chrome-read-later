import * as storage from "./storage.js";

const tab = function getCurrentTab() {
  chrome.tabs.query({ 'active': true, 'currentWindow': true }, tabs => {
    const url = tabs[0].url;
    const pageInfo = {
      url: url,
      title: tabs[0].title || url,
      favIconUrl: tabs[0].favIconUrl || 'src/images/32x32gray.png',
    }

    if (url === 'chrome://newtab/') return;
    storage.uniqueSet({
      [Date.now()]: { pageInfo }
    });
    final(tabs[0].id, 'chrome://newtab/');
  });
};

const final = function updateToNewTabForFinalTab(id, newTab) {
  chrome.tabs.query({}, tabs => {
    if (tabs.length === 1) {
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
