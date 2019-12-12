// https://developer.chrome.com/extensions/contextMenus#event-onClicked
export function onClicked(callback) {
  chrome.contextMenus.onClicked.addListener(callback)
}

// https://developer.chrome.com/extensions/contextMenus#method-create
export function create(settings) {
  chrome.contextMenus.create(settings)
}