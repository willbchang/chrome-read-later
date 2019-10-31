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

export function setPage(tab) {
  const page = {}
  page.url = tab.url
  page.title = tab.title || tab.url
  page.favIconUrl = tab.favIconUrl || "../images/32x32gray.png"
  page.date = Date.now()
  set({ [page.url]: page })
}
