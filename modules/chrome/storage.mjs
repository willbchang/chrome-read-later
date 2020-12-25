// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage

class Storage {
  constructor(where) {
    this.storage = chrome.storage[where]
  }

  get() {
    return new Promise(resolve => this.storage.get(resolve))
  }

  set(page) {
    return new Promise(resolve =>
      this.storage.set({[page.url]: page}, resolve)
    )
  }

  remove(url) {
    return this.storage.remove(url)
  }

  clear() {
    return this.storage.clear()
  }

  // NOTICE: This returns an Array of objects.
  async sortByLatest() {
    const pages = await this.get()
    return Object.values(pages).sort((a, b) => b.date - a.date)
  }

  async getScrollPosition(url) {
    const pages = await this.get()
    const page = pages[url]
    return {
      scroll: {
        top:    page.scroll.top,
        height: page.scroll.height,
      },
    }
  }
}

export const sync = new Storage('sync')
export const local = new Storage('local')
