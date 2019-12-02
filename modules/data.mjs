import './prototype.mjs'
// https://mdn.io/object.spread
// https://git.io/Je6Aq
// https://mdn.io/default_parameters
// Use object as parameter to get optional parameter.
// Set default empty value to 'selection' to avoid
// Cannot read property of undefined
export function getPageInfo({tab, position = {}, selection = {}}) {
// https://mdn.io/computed_property_names
  return {
    [getUrl()]: {
      url: getUrl(),
      title: getTitle(),
      favIconUrl: getFavIconUrl(),
      date: getDate(),
      scrollTop: getScrollTop(),
      scrollPercent: getScrollPercent(),
    }
  }

  function getUrl() {
    return selection.linkUrl || tab.url
  }

  function getTitle() {
    if (selection.isEmpty()) return tab.title || tab.url
    // TODO: Will fetch page info(title, favicon) via url in later version.
    // Select item in google search will also select its url.
    if (tab.url.includes('://www.google.'))
      return filterUrl(selection.selectionText)
    return selection.selectionText || selection.url
  }

  function filterUrl(text) {
    // FIX: Cannot avoid http:// in google search,
    // the http:// doesn't reveal. Needs to use url regex.
    return text.split('https://')[0]
  }

  function getFavIconUrl() {
    return tab.favIconUrl || '../images/32x32gray.png'
  }

  function getDate() {
    return Date.now()
  }

  function getScrollTop() {
    return position.scrollTop || 0
  }

  function getScrollPercent() {
    return position.scrollPercent || '0%'
  }
}

export function getReadingItem(page) {
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
  }

  // This function is especially for but not limited to
  // the case: url is title. The url is treated as
  // one word and not in the dictionary, so it can't be
  // broken automatically with hyphen.
  // This is also a word: tester-testABCDEFGHI?title
  function breakLongWord(word) {
    if (word.isMaxLength)
      return `<span style="word-break: break-all">${word}</span>`
    return word
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
