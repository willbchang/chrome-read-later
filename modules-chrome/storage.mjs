// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage
export const sync = {}
sync.remove = url => chrome.storage.sync.remove(url)
sync.get = () => new Promise(resolve => chrome.storage.sync.get(resolve))

// NOTICE: This returns an Array of objects.
export async function sortByLatest() {
  const pages = await sync.get()
  return Object.values(pages)
    .sort((a, b) => b.date - a.date)
}

export async function getScrollPosition(url) {
  const pages = await sync.get()
  const page = pages[url]
  return {
    scroll: {
      top:    page.scroll.top,
      height: page.scroll.height,
    },
  }
}

export async function set(page) {
  return new Promise(resolve =>
    chrome.storage.sync.set({[page.url]: page}, resolve)
  )
}
