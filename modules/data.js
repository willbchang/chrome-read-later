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
    title: selection.selectionText || selection.linkUrl,
    favIconUrl: tab.favIconUrl || '../images/32x32gray.png',
    date: Date.now(),
  }
}

export function getReadingListFrom(page) {
  return ` 
      <li id=${page.date}>
        <img src="${page.favIconUrl}" alt="favIcon">
        <a href="${page.url}" title="${page.url}" style="${getTitleColor()}"> ${getTitle()}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleColor() {
    if (page.url === page.title)
      return 'color: gray'
    return ''
  }

  function getTitle() {
    return page.title.split(' ').map(word => breakLongWord(word)).join(' ')
  }

  function breakLongWord(word) {
    if (word.length >= 30)
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
