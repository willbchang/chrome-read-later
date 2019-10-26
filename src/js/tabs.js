function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
}

function update(id, aUrl) {
  chrome.tabs.update(id, { url: aUrl })
}

function remove(id) {
  chrome.tabs.remove(id);
}

function stayEmpty(id) {
  update(id, 'chrome://newtab/')
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

function set(id) {
  all(aTabs => {
    aTabs.length === 1 ? stayEmpty(id) : remove(id)
  });
}

export { query, remove, current, all, get, set, stayEmpty }
