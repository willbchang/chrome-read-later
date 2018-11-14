const check = function checkDuplicateURL(url, title, favIconUrl) {
  chrome.storage.sync.get(data => {
    for (const time in data) {
      if (data[time].url === url) return;
    }

    set(url, title, favIconUrl);
  });
};

const set = function setChromeStorage(url, title, favIconUrl) {
  chrome.storage.sync.set({
    [Date.now()]: { url, title, favIconUrl, }
  });
};

const tab = function getCurrentTab() {
  chrome.tabs.query({'active': true, 'currentWindow': true},  tabs => {
    const url = tabs[0].url;
    const title = tabs[0].title || url;
    const favIconUrl = tabs[0].favIconUrl || 'images/32x32gray.png';
    const id = tabs[0].id;
    const newTab = 'chrome://newtab/';

    if (url === newTab) return;
    check(url, title, favIconUrl);
    close(id);
  });
};

const close = function closeCurrentTab(id) {
  chrome.tabs.remove(id);
};

const click = function rightClickLinkAddToReadingList(info, tab) {
  const url = info.linkUrl;
  const title = info.selectionText || url;
  const favIconUrl = tab.favIconUrl || 'images/32x32orange.png';

  check(url, title, favIconUrl);
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