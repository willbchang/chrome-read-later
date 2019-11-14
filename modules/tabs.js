export function query(info) {
  return new Promise(resolve => {
    chrome.tabs.query(info, resolve)
  })
}

export async function all() {
  return await query({})
}

export async function current() {
  const info = {
    active: true,
    currentWindow: true,
  }
  const tabs = await query(info)
  return tabs[0]
}

export function update(href) {
  return new Promise(resolve => {
    chrome.tabs.update(null, { url: href }, resolve)
  })
}

export function create(href) {
  return new Promise(resolve => {
    chrome.tabs.create({ url: href }, resolve)
  })
}

export function remove(tab) {
  chrome.tabs.remove(tab.id)
}

export function empty() {
  update('chrome://newtab/')
}

export function isEmpty(tab) {
  return tab.url === 'chrome://newtab/'
}

export function sendMessage(tabId, message) {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, message, resolve)
  })
}

export function onComplete() {
  return new Promise(resolve => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener)
        resolve(tabId)
      }
    })
  })
}
