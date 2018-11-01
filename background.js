const get = function getChromeStorage(set, url, title, favIconUrl) {
  chrome.storage.sync.get(data => {
    for (const time in data) {
      if (data[time].url === url) return;
    }

    set(url, title, favIconUrl);
  });
};

const set = function setChromeStorage(url, title, favIconUrl) {
  chrome.storage.sync.set({
    [Date.now()]: { url, title, favIconUrl }
  });
};

const query = function getTabsInfo(get, set, close) {
  chrome.tabs.query({'active': true, 'currentWindow': true},  tabs => {
    const url = tabs[0].url;
    const title = tabs[0].title;
    const favIconUrl = tabs[0].favIconUrl || 'images/32x32gray.png';
    const id = tabs[0].id;

    get(set, url, title, favIconUrl);
    close(id);
  });
};

const close = function closeCurrentTab(id) {
  chrome.tabs.remove(id);
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ 'title': 'Read later', 'contexts': ['link'], 'id': 'read-later' });
});

chrome.commands.onCommand.addListener(command => {
  if (command === 'read-later') query(get, set, close);
});

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId !== 'read-later') return;

  const url = info.linkUrl;
  const title = info.selectionText;
  const favIconUrl = 'images/32x32orange.png';

  get(set, url, title, favIconUrl);
});