// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage
export function remove(url) {
  chrome.storage.sync.remove(url)
}

export function get() {
  return new Promise(resolve => {
    chrome.storage.sync.get(resolve)
  })
}

// NOTICE: This returns an Array.
export async function getSorted() {
  const pages = await get()
  return Object.values(pages).sort((a, b) => a.date - b.date)
}

export async function getPosition(url) {
  const pages = await get()
  const page = pages[url]
  const position = {}
  position.scrollTop = page.scrollTop
  return position
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
  // The [key] feature is Computed Property Names.
  // https://mdn.io/computed_property_names
  // https://mdn.io/object.spread
  set({ [page.url]: { ...page, ...position } })
}

export function setSelection(tab, selection) {
  const page = {}
  page.url = selection.linkUrl
  page.title = selection.selectionText || selection.linkUrl
  page.favIconUrl = tab.favIconUrl || '../images/32x32gray.png'
  page.date = Date.now()
  set({ [page.url]: page })
}
