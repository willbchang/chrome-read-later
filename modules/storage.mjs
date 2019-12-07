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

export async function getScrollPosition(url) {
  const pages = await get()
  const page = pages[url]
  console.log(page)
  return {
    scrollTop: page.scrollTop,
  }
}

export function set(page) {
  console.log(page)
  chrome.storage.sync.set(page)
}

