function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}

export { onInstalled }
