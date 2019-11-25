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
        <a href="${page.url}" title="${page.url}" style="${setTitleColor()} ${breakLongWord()}">${page.title}</a>
        ${setScrollPercent()}
      </li>
    `

  function setTitleColor() {
    if (page.url === page.title) return 'color: gray'
    return ''
  }

  function breakLongWord() {
    for (let word of page.title.split(' ')) {
      if (word.length >= 30) return 'word-break: break-all'
    }
    return ''
  }

  function setScrollPercent() {
    // Set scroll percent when page.scrollTop doesn't exist or the value is zero.
    // e.g. tabs.setSelection() does not save scroll position.
    if (page.scrollTop)
      return `<span class="position">${page.scrollPercent}</span>`
    return ''
  }
}