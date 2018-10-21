function addToReadingList() {
  chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    const url = tabs[0].url,
        title = tabs[0].title;

    const port = chrome.extension.connect({
      name: "Send tab url and title"
    });

    port.postMessage([url,title]);
    chrome.storage.sync.set({[url]: title});
    chrome.tabs.remove(tabs[0].id);
  });
}

chrome.commands.onCommand.addListener(function(command) {
  if (command == "read-later") {
    addToReadingList();
  }
});