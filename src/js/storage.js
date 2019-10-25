function get(callback) {
  chrome.storage.sync.get(callback)
}

function set(data) {
  chrome.storage.sync.set(data)
}

function has(data, url) {
  return Object.values(data).map(x => x.url).includes(url)
}

export { get, set, has }
