export function get(callback) {
  chrome.storage.sync.get(callback)
}

export function remove(url) {
  chrome.storage.sync.remove(url)
}

export function clear() {
  chrome.storage.sync.clear()
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
  Object.assign(page, position)
  page.scrollPercent = percent(page.scrollBottom, page.scrollHeight)
  set({ [page.url]: page })

  function percent(x, y) {
    return Math.floor((x / y) * 100) + '%'
  }
}

export function setSelection(tab, selection) {
  const page = {}
  page.url = selection.linkUrl
  page.title = selection.selectionText || selection.linkUrl
  page.favIconUrl = tab.favIconUrl || '../images/32x32gray.png'
  page.date = Date.now()
  set({ [page.url]: page })
}
