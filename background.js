const get = function getChromeStorage(url, title, callback) {
  chrome.storage.sync.get(data => {
    for (const time in data) {
      if (data[time].url === url) return;
    }
    callback(url, title);
  });
};

const set = function setChromeStorage(url, title) {
  chrome.storage.sync.set({
    [Date.now()]: { title, url }
  });
};

function addToReadingList() {
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    const url = tabs[0].url,
        title = tabs[0].title;

    get(url, title, set);
    chrome.tabs.remove(tabs[0].id);
  });
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({"title": "Read later", "contexts": ["link"], "id": "read-later"});
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "read-later") addToReadingList();
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId !== "read-later") return;

  const url = info.linkUrl,
      title = info.selectionText;

  get(url, title, set);
});