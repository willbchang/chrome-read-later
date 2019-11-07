export function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}

export function onCommand(callback) {
  chrome.commands.onCommand.addListener(callback)
}

export function onClicked(callback) {
  chrome.contextMenus.onClicked.addListener(callback)
}

export function createContextMenus(settings) {
  chrome.contextMenus.create(settings)
}

export function sendMessage(message) {
  chrome.runtime.sendMessage(message)
}

export function onMessage(response) {
  chrome.runtime.onMessage.addListener(function(request, sender, send) {
    send(response)
  })
}
