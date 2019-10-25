function get(callback) {
  chrome.storage.sync.get(callback)
}

function set(page) {
  chrome.storage.sync.set(page)
}

function has(pages, page) {
  return Object.values(pages).map(x => x.url)
  .includes(Object.values(page)[0].url)
}

function filter(page, set) {
  get((pages) => {
    if (!has(pages, page)) set()
  })
}

function uniqueSet(page) {
  filter(page, () => { set(page) })
}

export { get, set, uniqueSet }
