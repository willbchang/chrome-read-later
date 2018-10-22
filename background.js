function connectToPopup(url, title) {
  const port = chrome.extension.connect({
    name: "Send tab url and title"
  });

  port.postMessage([url,title]);
  chrome.storage.sync.set({[url]: title});
}

function addToReadingList() {
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    const url = tabs[0].url,
        title = tabs[0].title;

    connectToPopup(url, title);
    chrome.tabs.remove(tabs[0].id);
  });
}

chrome.contextMenus.create({"title": "Read later", "contexts": ["link"], "id": "read-later"});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "read-later") {
    addToReadingList();
  }
});

chrome.contextMenus.onClicked.addListener(function (info) {
  if (info.menuItemId === "read-later") {
    connectToPopup(info.linkUrl, info.selectionText);
  }
});