export function remove(url) {
  chrome.storage.sync.remove(url)
}

export function clear() {
  chrome.storage.sync.clear()
}

export function get() {
  return new Promise(resolve => {
    chrome.storage.sync.get(resolve)
  })
}

export function getSorted(callback) {
  get().then(pages => {
    callback(Object.values(pages).sort((a, b) => a.date - b.date))
  })
}

export function getPosition(url) {
  return get().then(pages => {
    const page = pages[url]
    const position = {}
    position.scrollTop = page.scrollTop
    return position
  })
}

export function set(page) {
  chrome.storage.sync.set(page)
}

export function setPage(tab, position) {
  const page = {}
  page.url = tab.url
  page.title = tab.title || tab.url
  page.favIconUrl = tab.favIconUrl || '../images/32x32gray.png'
  page.date = Date.now()
  set({ [page.url]: Object.assign(page, position) })
}

export function setSelection(tab, selection) {
  const page = {}
  page.url = selection.linkUrl
  page.title = selection.selectionText || selection.linkUrl
  page.favIconUrl = tab.favIconUrl || '../images/32x32gray.png'
  page.date = Date.now()
  set({ [page.url]: page })
}
