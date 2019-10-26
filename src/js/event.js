function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}

function onCommand(callback) {
  chrome.commands.onCommand.addListener(callback)
}

function onClicked(callback) {
  chrome.contextMenus.onClicked.addListener(callback)
}

export { onInstalled, onCommand, onClicked }
