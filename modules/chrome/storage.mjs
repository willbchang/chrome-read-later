// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage

class Storage {
  constructor(where) {
    this.where = where
  }
}

export const sync = new Storage('sync')
export const local = new Storage('local')


sync.get = () => new Promise(resolve => chrome.storage.sync.get(resolve))

sync.set = page => new Promise(resolve =>
  chrome.storage.sync.set({[page.url]: page}, resolve)
)

sync.remove = url => chrome.storage.sync.remove(url)

// NOTICE: This returns an Array of objects.
sync.sortByLatest = async () => {
  const pages = await sync.get()
  console.log(pages)
  debugger
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


local.clear = () => chrome.storage.local.clear()

local.get = (key = null) => new Promise(resolve =>
  chrome.storage.local.get(key, resolve)
)

local.set = page => new Promise(resolve =>
  chrome.storage.local.set({[page.url]: page}, resolve)
)

local.remove = url => chrome.storage.local.remove(url)

// NOTICE: This returns an Array of objects.
local.sortHistoryByLatest = async () => {
  const pages = await local.get()
  return Object.values(pages).sort((a, b) => b.date - a.date)
}
