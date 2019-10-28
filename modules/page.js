export function get(info, tab) {
  return {
    [Date.now()]: {
      url: info.linkUrl,
      title: info.selectionText || info.linkUrl,
      favIconUrl: tab.favIconUrl || '../images/32x32orange.png',
    }
  }
}
