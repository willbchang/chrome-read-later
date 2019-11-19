// https://developer.chrome.com/extensions/tabs#method-query
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

// https://developer.chrome.com/extensions/tabs#method-update
export function update(href) {
  return new Promise(resolve => {
    chrome.tabs.update(null, { url: href }, resolve)
  })
}

export function empty() {
  update('chrome://newtab/')
}

export function isEmpty(tab) {
  return ['chrome://newtab/', 'about:blank'].includes(tab.url)
}

// https://developer.chrome.com/extensions/tabs#method-create
export function create(href) {
  return new Promise(resolve => {
    chrome.tabs.create({ url: href }, resolve)
  })
}

// https://developer.chrome.com/extensions/tabs#method-remove
export function remove(tab) {
  chrome.tabs.remove(tab.id)
}

// https://developer.chrome.com/extensions/tabs#method-sendMessage
export function sendMessage(tabId, message) {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, message, resolve)
  })
}

// https://developer.chrome.com/extensions/tabs#event-onUpdated
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
