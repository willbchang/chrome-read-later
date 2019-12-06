import * as data from '../modules/data.mjs'
import * as storage from '../modules/storage.mjs'
import * as tabs from '../modules/tabs.mjs'

export async function save() {
  // It will only set the tab info if position is undefined.
  // Runs smoothly even if it's offline, chrome://*, etc.
  const tab = await tabs.queryCurrent()
  const position = await tabs.sendMessage(tab.id, {info: 'get position'})
  storage.set(data.getInfo({tab, position}))

  await tabs.isFinalTab() ? tabs.empty() : tabs.remove(tab)
}

export function saveSelection(tab, selection) {
  storage.set(data.getInfo({tab, ...selection}))
}

export async function open({url}) {
  const newTab = await tabs.isEmptyTab()
    ? await tabs.update(url)
    : await tabs.create(url)

  const position = await storage.getPosition(url)
  storage.remove(url)

  const tabId = await tabs.onComplete(newTab)
  await tabs.sendMessage(tabId, position)
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

  function getScrollTop() {
    return document.documentElement.scrollTop
  }

  function getScrollBottom() {
    return window.scrollY + window.innerHeight
  }

  function getScrollHeight() {
    return document.documentElement.scrollHeight
  }
}

export function setScrollPosition({scrollTop}) {
  window.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
}