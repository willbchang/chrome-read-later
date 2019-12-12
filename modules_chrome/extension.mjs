// https://developer.chrome.com/extensions/runtime#method-sendMessage
export function sendMessage(info) {
  chrome.runtime.sendMessage(info)
}

// https://developer.chrome.com/extensions/runtime#event-onMessage
export function onMessage(callback) {
  chrome.runtime.onMessage.addListener(callback)
}

// https://developer.chrome.com/extensions/runtime#event-onInstalled
export function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}
