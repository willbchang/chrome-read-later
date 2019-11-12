export function query(info) {
  return new Promise(resolve => {
    chrome.tabs.query(info, resolve)
  })
}

export function current() {
  const info = {
    active: true,
    currentWindow: true,
  }

  return new Promise(resolve => {
    query(info).then(tabs => resolve(tabs[0]))
  })
}

export function update(href, callback) {
  chrome.tabs.update(null, { url: href }, callback)
}

export function create(href, callback) {
  chrome.tabs.create({ url: href }, callback)
}

export function remove(tab) {
  chrome.tabs.remove(tab.id)
}

export function empty(tab) {
  update(tab.id, 'chrome://newtab/')
}

export function isEmpty(tab) {
  return tab.url === 'chrome://newtab/'
}

export function sendMessage(tabId, message, callback) {
  chrome.tabs.sendMessage(tabId, message, callback)
}

export function onUpdate(callback) {
  chrome.tabs.onUpdated.addListener(callback)
}

export function onComplete(callback) {
  onUpdate(function listener(tabId, info) {
    if (info.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener)
      callback(tabId)
    }
  })
}
