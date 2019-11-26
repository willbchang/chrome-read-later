// https://mdn.io/object.assign
// https://git.io/Je6Aq
export function getFromPage(tab, position) {
  return Object.assign({
    url: tab.url,
    title: tab.title || tab.url,
    favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    date: Date.now(),
  }, position)
}

export function getFromSelection(tab, selection) {
  return {
    url: selection.linkUrl,
    title: filterSelectionText() || selection.linkUrl,
    favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    date: Date.now(),
  }

  function filterSelectionText() {
    // Select item in google search will also select its url.
    if (tab.url.includes('://www.google.'))
      // FIX: Cannot avoid http:// in google search,
      // the http:// doesn't reveal. Needs to use url regex.
      return selection.selectionText.split('https://')[0]
    return selection.selectionText
  }
}

export function getReadingListFrom(page) {
  return ` 
      <li id=${page.date}>
        <img src="${page.favIconUrl}" alt="favIcon">
        <a href="${page.url}" title="${page.url}" ${getTitleColor()}> ${getTitle()}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleColor() {
    if (page.url === page.title)
      return 'style="color: gray"'
    return ''
  }

  function getTitle() {
    return page.title.split(' ').map(breakLongWord).join(' ')

    // This function is especially for but not limited to
    // the case: url is title. The url is treated as
    // one word and not in the dictionary, so it can't be
    // broken automatically with hyphen.
    function breakLongWord(word) {
      if (word.length >= 30)
        return `<span style="word-break: break-all">${word}</span>`
      return word
    }
  }


  function getScrollPercent() {
    // Get scroll percent when page.scrollTop doesn't exist or the value is zero.
    // e.g. getFromPage(tab) and getFromSelection(tab, position),
    // they do not save scroll position from the web page.
    if (page.scrollTop)
      return `<span class="position">${page.scrollPercent}</span>`
    return ''
  }
}
