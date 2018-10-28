function addToReadingList() {
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    const url = tabs[0].url,
        title = tabs[0].title;

    chrome.storage.sync.set({[url]: title});
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
  if (info.menuItemId === "read-later") {
    chrome.storage.sync.get([info.linkUrl], function(link) {
      if (typeof link[info.linkUrl] === 'undefined') {
        chrome.storage.sync.set({[info.linkUrl]: info.selectionText});
      }
    });
  }
});