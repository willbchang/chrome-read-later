export function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}

export function onCommand(callback) {
  chrome.commands.onCommand.addListener(callback)
}

export function onClicked(callback) {
  chrome.contextMenus.onClicked.addListener(callback)
}

export function setContextMenus() {
  onInstalled(() => {
    chrome.contextMenus.create({
      title: 'Read later',
      contexts: ['link'],
      id: 'read-later',
    });
  });
}
