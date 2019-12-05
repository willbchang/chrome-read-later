import './prototype.mjs'

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
export async function getByLatest() {
  const pages = await get()
  return Object.values(pages).sort((a, b) => b.date - a.date)
}

export async function getPagePosition(url) {
  const pages = await get()
  const page = pages[url]
  return {
    scrollTop: page.scrollTop,
  }
}

export function set(page) {
  chrome.storage.sync.set(page)
}

// https://mdn.io/object.spread
// https://git.io/Je6Aq
// https://mdn.io/default_parameters
// Use object as parameter to get optional parameter.
// Set default empty value to 'selection' to avoid
// Cannot read property of undefined
export function setPageInfo({tab, position = {}, selection = {}}) {
  const page = {
    url: getUrl(),
    title: getTitle(),
    favIconUrl: getFavIconUrl(),
    date: getDate(),
    scrollTop: getScrollTop(),
    scrollPercent: getScrollPercent(),
  }


  // https://mdn.io/computed_property_names
  set({[page.url]: page})

  function getUrl() {
    return selection.linkUrl || tab.url
  }

  function getTitle() {
    if (selection.isEmpty()) return tab.title || tab.url
    // TODO: Will fetch page info(title, favicon) via url in later version.
    // Select item in google search will also select its url.
    if (tab.url.includes('://www.google.'))
      return filterUrl(selection.selectionText)
    return selection.selectionText || selection.url

    function filterUrl(text) {
      // FIX: Cannot avoid http:// in google search,
      // the http:// doesn't reveal. Needs to use url regex.
      return text.split('https://')[0]
    }
  }

  function getFavIconUrl() {
    return tab.favIconUrl || '../images/32x32gray.png'
  }

  function getDate() {
    return Date.now()
  }

  function getScrollTop() {
    return position.scrollTop || 0
  }

  function getScrollPercent() {
    return percent(position.scrollBottom / position.scrollHeight)

    function percent(num = 0) {
      return Math.floor(num * 100) + '%'
    }
  }
}
