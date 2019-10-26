function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
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

function isEmpty(tab) {
  return tab.url === 'chrome://newtab/'
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

export { query, current, all, get, isEmpty }
