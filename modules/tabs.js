export function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
}

export function update(tab, href) {
  chrome.tabs.update(tab.id, { url: href })
}

export function create(href) {
  chrome.tabs.create({ url: href })
}

export function remove(tab) {
  chrome.tabs.remove(tab.id)
}

export function empty(tab) {
  update(tab.id, 'chrome://newtab/')
}

export function current(callback) {
  const queryInfo = {
    'active': true,
    'currentWindow': true
  }
  query(queryInfo, (tabs) => {
    callback(tabs[0])
  })
}
