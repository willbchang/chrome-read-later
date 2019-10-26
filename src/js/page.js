function get(info, tab) {
  return {
    [Date.now()]: {
      url: info.linkUrl,
      title: info.selectionText || url,
      favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    }
  }
}

export { get }
