// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage
export const sync = {}

sync.get = () => new Promise(resolve => chrome.storage.sync.get(resolve))

sync.set = page => new Promise(resolve =>
  chrome.storage.sync.set({[page.url]: page}, resolve)
)

sync.remove = url => chrome.storage.sync.remove(url)

// NOTICE: This returns an Array of objects.
sync.sortByLatest = async () => {
  const pages = await sync.get()
  return Object.values(pages).sort((a, b) => b.date - a.date)
}

sync.getScrollPosition = async url => {
  const pages = await sync.get()
  const page = pages[url]
  return {
    scroll: {
      top:    page.scroll.top,
      height: page.scroll.height,
    },
  }
}

export const local = {}

local.get = (key = null) => new Promise(resolve =>
  chrome.storage.local.get(key, resolve)
)

local.set = (key, value) => new Promise(resolve =>
  chrome.storage.local.set({[key]: value}, resolve)
)

local.setHistory = async page => {
  // It gets an object instead of the value
  let {history} = await local.get('history')
  if (history === undefined) history = {}
  history[page.url] = page
  await local.set('history', history)
}
