export function query(info, callback) {
  chrome.tabs.query(info, callback)
}

export function current(callback) {
  const info = {
    active: true,
    currentWindow: true,
  }

  query(info, tabs => {
    callback(tabs[0])
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
