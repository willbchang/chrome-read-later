function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
}

function update(tab, url) {
  chrome.tabs.update(tab.id, { "url": url })
}

function remove(tab) {
  chrome.tabs.remove(tab.id);
}

function empty(tab) {
  update(tab.id, 'chrome://newtab/')
}

function isEmpty(tab) {
  return tab.url === 'chrome://newtab/'
}

function current(callback) {
  const queryInfo = {
    'active': true,
    'currentWindow': true
  }
  query(queryInfo, (tabs) => {
    callback(tabs[0]);
  })
}

function all(callback) {
  query({}, callback)
}

function get(tab) {
  return {
    [Date.now()]: {
      url: tab.url,
      title: tab.title || tab.url,
      favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    }
  }
}

function set(tab) {
  all(tabs => {
    tabs.length === 1 ? empty(tab) : remove(tab)
  });
}

export { current, get, set, isEmpty }
