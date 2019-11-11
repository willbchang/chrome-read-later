export function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
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

export function emptyOrRemove(tab) {
  query({}, tabs => {
    tabs.length === 1 ? empty(tab) : remove(tab)
  })
}

export function openInCurrentOrNewTab(href, message) {
  current(tab => {
    isEmpty(tab)
      ? update(href, onComplete(message))
      : create(href, onComplete(message))
  })
}

export function current(callback) {
  const queryInfo = {
    active: true,
    currentWindow: true,
  }
  query(queryInfo, tabs => {
    callback(tabs[0])
  })
}

export function sendMessage(tabId, message, callback) {
  chrome.tabs.sendMessage(tabId, message, callback)
}

export function onUpdate(callback) {
  chrome.tabs.onUpdated.addListener(callback)
}

export function onComplete(message) {
  onUpdate(function listener(tabId, info) {
    if (info.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener)
      chrome.tabs.sendMessage(tabId, message)
    }
  })
}
