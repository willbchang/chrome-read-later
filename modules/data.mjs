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
    title: getTitle(),
    favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    date: Date.now(),
  }

  function getTitle() {
    // TODO: Will fetch page info(title, favicon) via url in later version.
    // Select item in google search will also select its url.
    if (tab.url.includes('://www.google.'))
      return filterUrl(selection.selectionText)
    return selection.selectionText || selection.linkUrl
  }

  function filterUrl(text) {
    // FIX: Cannot avoid http:// in google search,
    // the http:// doesn't reveal. Needs to use url regex.
    return text.split('https://')[0]
  }
}

export function getReadingItemFrom(page) {
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
    // ul: 300px(width) - 15px*2(padding) = 270px(content width)
    // favicon:  16px(content width) + 5px*2(padding) = 26px(width)
    // li: 270px - 26px = 244px
    // letter-spacing: 0.4px
    // body: font-size: 14px
    // Check: https://jsfiddle.net/2750Lujs
    // The largest letter W has 13px(NOTE: some fonts are not equal width)
    // 244px / 13.4px(letter width) ≈ 18 letters
    // Assume a word is made by W, if the length is larger than 244px,
    // the favicon and the word won't be in the same line,
    // or the word in title will ugly break the line.
    if (word.length >= 18)
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
