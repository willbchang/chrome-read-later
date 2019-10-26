function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
}

function update(tab, aUrl) {
  chrome.tabs.update(tab.id, { url: aUrl })
}

function remove(tab) {
  chrome.tabs.remove(tab.id);
}

function stayEmpty(tab) {
  update(tab.id, 'chrome://newtab/')
}

function current(callback) {
  const queryInfo = {
    'active': true,
    'currentWindow': true
  }
  query(queryInfo, (aTabs) => {
    callback(aTabs[0]);
  })
}

function all(callback) {
  query({}, callback)
}

function get(tab) {
  return {
    [Date.now()]: {
      url: tab.url,
      title: tab.title || url,
      favIconUrl: tab.favIconUrl || 'src/images/32x32gray.png',
    }
  }
}

function set(tab) {
  all(aTabs => {
    aTabs.length === 1 ? stayEmpty(tab) : remove(tab)
  });
}

export { query, remove, current, all, get, set, stayEmpty }
