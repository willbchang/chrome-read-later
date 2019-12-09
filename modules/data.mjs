import './prototype.mjs'

class PageGenerator {
  constructor(tab, position, selection) {
    this.tab = tab
    this.position = position
    this.selection = selection
  }

  get url() {
    return this.selection.linkUrl || this.tab.url
  }

  get title() {
    if (!this.selection.selectionText) return this.tab.title || this.tab.url
    // TODO: Will fetch page info(title, favicon) via url in later version.
    // Select item in google search will also select its url.
    if (this.tab.url.includes('://www.google.'))
      return filterUrl(this.selection.selectionText)
    return this.selection.selectionText || this.selection.linkUrl

    function filterUrl(text) {
      // FIX: Cannot avoid http:// in google search,
      // the http:// doesn't reveal. Needs to use url regex.
      return text.split('https://')[0]
    }
  }

  get favIconUrl() {
    return this.tab.favIconUrl || '../images/32x32gray.png'
  }

  get date() {
    return Date.now()
  }

  get scrollTop() {
    return this.position.scrollTop || 0
  }

  get scrollPercent() {
    return percent(this.position.scrollBottom / this.position.scrollHeight)

    function percent(num) {
      return (Math.floor(num * 100) || 0) + '%'
    }
  }
}

function createPageGenerator(tab, position, selection) {
  return new PageGenerator(tab, position, selection)
}

// https://git.io/Je6Aq
// https://mdn.io/object.spread
// https://mdn.io/default_parameters
// https://mdn.io/computed_property_names
// Use object as parameter to get optional parameter.
// Set default empty value to 'selection' to avoid
// Cannot read property of undefined
export function getJson({tab, position = {}, selection = {}}) {
  const page = createPageGenerator(tab, position, selection)
  return {
    [page.url]: {
      url: page.url,
      title: page.title,
      favIconUrl: page.favIconUrl,
      date: page.date,
      scrollTop: page.scrollTop,
      scrollPercent: page.scrollPercent,
    }
  }
}

export function getHtml(page) {
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
