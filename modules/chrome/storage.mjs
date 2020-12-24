// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage

class Storage {
  constructor(where) {
    this.where = where
  }

  get() {
    return new Promise(resolve => chrome.storage[this.where].get(resolve))
  }

  set(page) {
    return new Promise(resolve =>
      chrome.storage[this.where].set({[page.url]: page}, resolve)
    )
  }
}

export const sync = new Storage('sync')
export const local = new Storage('local')

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

local.remove = url => chrome.storage.local.remove(url)

// NOTICE: This returns an Array of objects.
local.sortHistoryByLatest = async () => {
  const pages = await local.get()
  return Object.values(pages).sort((a, b) => b.date - a.date)
}
