import './prototype.mjs'

export function renderHtmlText(page) {
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
    // This is also a word: tester-testABCDEFGHI?title
    function breakLongWord(word) {
      if (word.isMaxLength())
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
