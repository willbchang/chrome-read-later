function get(callback) {
  chrome.storage.sync.get(callback)
}

function set(data) {
  chrome.storage.sync.set(data)
}

export { get, set }
