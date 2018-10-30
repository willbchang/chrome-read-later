const get = function getChromeStorage(callback) {
  chrome.storage.sync.get(data => {
    const urls = [],times = [],  titles = [];

    for (const time in data) {
      times.push(time);
      urls.push(data[time].url);
      titles.push(data[time].title);
    }

    callback(urls, times, titles);
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
    get((urls) => {
      if (urls.includes(url)) return;
      set(url, title);
    });

    chrome.tabs.remove(tabs[0].id);
  });
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({"title": "Read later", "contexts": ["link"], "id": "read-later"});
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "read-later") {
    addToReadingList();
  }
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId !== "read-later") return;
  get((urls) => {
    if (!urls.includes(info.linkUrl)) return;
    set(info.linkUrl, info.selectionText);
  });
});