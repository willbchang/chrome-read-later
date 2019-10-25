function get(callback) {
  chrome.storage.sync.get(callback)
}

export { get }
