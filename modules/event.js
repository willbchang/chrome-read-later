function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}

function onCommand(callback) {
  chrome.commands.onCommand.addListener(callback)
}

function onClicked(callback) {
  chrome.contextMenus.onClicked.addListener(callback)
}

function setContextMenus() {
  onInstalled(() => {
    chrome.contextMenus.create({
      title: 'Read later',
      contexts: ['link'],
      id: 'read-later',
    });
  });
}

export { onCommand, onClicked, setContextMenus }
