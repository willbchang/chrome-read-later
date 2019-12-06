import * as storage from '../modules/storage.mjs'
import * as tabs from '../modules/tabs.mjs'

export async function get() {
  // It will only set the tab info if position is undefined.
  // Runs smoothly even if it's offline, chrome://*, etc.
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  storage.set(getInfo({tab, position}))

  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
}

export async function set({url}) {
  const newTab = await tabs.isEmptyTab()
    ? await tabs.update(url)
    : await tabs.create(url)

  const position = await storage.getPagePosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(newTab)
  await tabs.sendMessage(tabId, position)
}

// https://git.io/Je6Aq
// https://mdn.io/object.spread
// https://mdn.io/default_parameters
// https://mdn.io/computed_property_names
// Use object as parameter to get optional parameter.
// Set default empty value to 'selection' to avoid
// Cannot read property of undefined
export function getInfo({tab, position = {}, selectionText, linkUrl}) {
  return {
    [getUrl]: {
      url: getUrl(),
      title: getTitle(),
      favIconUrl: getFavIconUrl(),
      date: getDate(),
      scrollTop: getScrollTop(),
      scrollPercent: getScrollPercent(),
    }
  }

  function getUrl() {
    return linkUrl || tab.url
  }

  function getTitle() {
    if (!selectionText) return tab.title || tab.url
    // TODO: Will fetch page info(title, favicon) via url in later version.
    // Select item in google search will also select its url.
    if (tab.url.includes('://www.google.'))
      return filterUrl(selectionText)
    return selectionText || linkUrl

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

    function percent(num) {
      return (Math.floor(num * 100) || 0) + '%'
    }
  }
}

// Use scrollBottom to calculate scrollPercent to avoid the situation:
// Scroll page to the bottom, but the percent is not 100%.
export function getScrollPosition() {
  // In popup.js, there is a `if` statement to check if the scrollTop is 0,
  // if it is 0, the scrollPercent won't add to popup.html.
  // Do not worry this situation: scrollTop: 0, scrollPercent: 100%
  return {
    scrollTop: getScrollTop(),
    scrollBottom: getScrollBottom(),
    scrollHeight: getScrollHeight(),
  }
}

export function setScrollPosition({scrollTop, scrollHeight}) {
  window.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
}


function getScrollTop() {
  return document.documentElement.scrollTop
}

function getScrollBottom() {
  return window.scrollY + window.innerHeight
}

function getScrollHeight() {
  return document.documentElement.scrollHeight
}