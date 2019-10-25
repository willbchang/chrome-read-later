function get(callback) {
  chrome.storage.sync.get(callback)
}

function set(page) {
  chrome.storage.sync.set(page)
}

function has(pages, url) {
  return Object.values(pages).map(x => x.url).includes(url)
}

function filter(url, set) {
  get((pages) => { if (!has(pages, url)) set() })
}

function uniqueSet(page) {
  filter(Object.values(page)[0].url, () => { set(page) })
}

export { get, set, uniqueSet }
