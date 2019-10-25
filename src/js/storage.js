function get(callback) {
  chrome.storage.sync.get(callback)
}

function set(data) {
  chrome.storage.sync.set(data)
}

function has(data, url) {
  return Object.values(data).map(x => x.url).includes(url)
}

function filter(url, set) {
  get((data) => { if (!has(data, url)) set() })
}

export { get, set, filter }
