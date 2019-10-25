function query(queryInfo, callback) {
  chrome.tabs.query(queryInfo, callback)
}

export { query }
