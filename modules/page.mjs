// Use scrollBottom to calculate scrollPercent to avoid the situation:
// Scroll page to the bottom, but the percent is not 100%.
class ScrollPosition {
  constructor({scrollTop, scrollHeight}) {
    this.scrollTop = scrollTop
    this.scrollHeight = scrollHeight
  }

  get top() {
    return this.scrollHeight
      ? this.dynamicTop
      : document.documentElement.scrollTop
  }

  get dynamicTop() {
    return this.scrollTop
      / this.scrollHeight
      * this.height
  }

  get height() {
    return document.documentElement.scrollHeight
  }

  get bottom() {
    return window.scrollY + window.innerHeight
  }

  scrollTo(top) {
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    })
  }
}

export function getScrollPosition() {
  // In popup.js, there is a `if` statement to check if the scrollTop is 0,
  // if it is 0, the scrollPercent won't add to popup.html.
  // Do not worry this situation: scrollTop: 0, scrollPercent: 100%
  const scrollPosition = new ScrollPosition({})
  return {
    scrollTop: scrollPosition.top,
    scrollBottom: scrollPosition.bottom,
    scrollHeight: scrollPosition.height,
  }
}

export function setScrollPosition(position) {
  const scrollPosition = new ScrollPosition(position)
  scrollPosition.scrollTo(scrollPosition.top)
}


