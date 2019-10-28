function get(callback) {
  chrome.storage.sync.get(callback)
}

function set(page) {
  chrome.storage.sync.set(page)
}

function remove(time) {
  chrome.storage.sync.remove(time)
}

function clear() {
  chrome.storage.sync.clear()
}

function has(pages, page) {
  return Object.values(pages).map(x => x.url)
    .includes(Object.values(page)[0].url)
}

function setUnique(page) {
  get((pages) => {
    if (!has(pages, page)) set(page)
  })
}

export { get, set, remove, clear, setUnique }
