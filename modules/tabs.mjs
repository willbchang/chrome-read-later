// https://developer.chrome.com/extensions/tabs#method-query
export function query(info) {
  return new Promise(resolve => {
    chrome.tabs.query(info, resolve)
  })
}

export async function queryAll() {
  return await query({})
}

export async function queryCurrent() {
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
    chrome.tabs.update(null, {url: href}, resolve)
  })
}

export function empty() {
  update('chrome://newtab/')
}

export async function isEmptyTab() {
  const tab = await queryCurrent()
  return ['chrome://newtab/', 'about:blank'].includes(tab.url)
}

export async function isFinalTab() {
  const allTabs = await queryAll()
  return allTabs.length === 1
}

// https://developer.chrome.com/extensions/tabs#method-create
export function create(href) {
  return new Promise(resolve => {
    chrome.tabs.create({url: href}, resolve)
  })
}

// https://developer.chrome.com/extensions/tabs#method-remove
export function remove(tab) {
  chrome.tabs.remove(tab.id)
}

// https://developer.chrome.com/extensions/tabs#method-sendMessage
export function sendMessage(tabId, message) {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, message, response => {
      resolve(response)
      // https://stackoverflow.com/a/28432087/9984029
      // Handle the error when there is no need to receive response.
      if (chrome.runtime.lastError)
        console.log('Handled Error:', chrome.runtime.lastError.message)
    })
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
