export function get(callback) {
  chrome.storage.sync.get(callback)
}

export function set(page) {
  chrome.storage.sync.set(page)
}

export function remove(key) {
  chrome.storage.sync.remove(key)
}

export function clear() {
  chrome.storage.sync.clear()
}
