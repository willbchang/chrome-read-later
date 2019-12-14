import './prototype.mjs'

class PageGenerator {
  constructor(tab) {
    this.tab = tab
  }

  get url() {
    return this.tab.url
  }

  get title() {
    return this.tab.title || this.tab.url
  }

  get favIconUrl() {
    return this.tab.favIconUrl || '../images/32x32gray.png'
  }

  get date() {
    return Date.now()
  }

  get scrollTop() {
    return 0
  }

  get scrollPercent() {
    return this.percent(0)
  }

  percent(num) {
    return Math.floor(num * 100) + '%'
  }

  get scrollHeight() {
    return 0
  }
}

class PositionGenerator extends PageGenerator {
  constructor(tab, position) {
    super(tab)
    this.scroll = position.scroll
  }

  get scrollTop() {
    return this.scroll.top
  }

  get scrollHeight() {
    return this.scroll.height
  }

  get scrollPercent() {
    return this.percent(this.scroll.bottom / this.scroll.height)
  }
}

class SelectionGenerator extends PageGenerator {
  constructor(tab, selection) {
    super(tab)
    this.selection = selection
  }

  get url() {
    return this.selection.linkUrl
  }

  get title() {
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
}

function createPageGenerator(tab, position, selection) {
  return selection.isEmpty()
    ? position.isEmpty()
      ? new PageGenerator(tab)
      : new PositionGenerator(tab, position)
    : new SelectionGenerator(tab, selection)
}

export function createPageData({tab, position = {}, selection = {}}) {
  const page = createPageGenerator(tab, position, selection)
  return {
    url: page.url,
    title: page.title,
    favIconUrl: page.favIconUrl,
    date: page.date,
    scroll: {
      top: page.scrollTop,
      height: page.scrollHeight,
      percent: page.scrollPercent,
    }
  }
}

export function renderHtmlList(page) {
  return ` 
      <li id=${page.date}>
        <img src="${page.favIconUrl}" alt="favIcon">
        <a href="${page.url}" title="${page.url}" ${getTitleColor()}> ${getTitle()}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleColor() {
    return page.url === page.title ? 'style="color: gray"' : ''
  }

  function getTitle() {
    return page.title.split(' ').map(breakLongWord).join(' ')

    function breakLongWord(word) {
      return word.isMaxLength()
        ? `<span style="word-break: break-all">${word}</span>`
        : word
    }
  }


  function getScrollPercent() {
    return page.scroll.top
      ? `<span class="position">${page.scroll.percent}</span>`
      : ''
  }
}
