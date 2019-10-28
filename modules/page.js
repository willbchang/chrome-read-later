export function get(selection, tab) {
  return {
    [Date.now()]: {
      url: selection.linkUrl,
      title: selection.selectionText || selection.linkUrl,
      favIconUrl: tab.favIconUrl || '../images/32x32orange.png',
    }
  }
}
