export function onCommand(callback) {
  chrome.commands.onCommand.addListener(callback)
}

export function sendMessage(info) {
  chrome.runtime.sendMessage(info)
}

export function onMessage(callback) {
  chrome.runtime.onMessage.addListener(callback)
}

export function onClicked(callback) {
  chrome.contextMenus.onClicked.addListener(callback)
}

export function createContextMenus(settings) {
  chrome.contextMenus.create(settings)
}

export function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}
