export function get(callback) {
  chrome.storage.sync.get(callback)
}

export function set(page) {
  chrome.storage.sync.set(page)
}

export function remove(url) {
  chrome.storage.sync.remove(url)
}

export function clear() {
  chrome.storage.sync.clear()
}
