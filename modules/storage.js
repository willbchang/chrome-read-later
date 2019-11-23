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

// The [key] feature is Computed Property Names.
// https://mdn.io/computed_property_names
export function set(page) {
  chrome.storage.sync.set({ [page.url]: page })
}

// https://mdn.io/object.assign
// https://git.io/Je6Aq
export function setPage(tab, position) {
  const page = Object.assign({
    url: tab.url,
    title: tab.title || tab.url,
    favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    date: Date.now(),
  }, position)
  set(page)
}

export function setSelection(tab, selection) {
  const page = {
    url: selection.linkUrl,
    title: selection.selectionText || selection.linkUrl,
    favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    date: Date.now(),
  }
  set(page)
}
