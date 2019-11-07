export function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
}

export function update(href) {
  chrome.tabs.update(null, { url: href })
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

export function current(callback) {
  const queryInfo = {
    active: true,
    currentWindow: true,
  }
  query(queryInfo, tabs => {
    callback(tabs[0])
  })
}

export function sendMessage(tab, message, callback) {
  chrome.tabs.sendMessage(tab.id, message, response => {
    callback(response)
  })
}
