// Use scrollBottom to calculate scrollPercent to avoid the situation:
// Scroll page to the bottom, but the percent is not 100%.
class ScrollPosition {
  constructor(position) {
    this.position = position
  }

  get scrollTop() {
    return this.position.scrollHeight
      ? this.dynamicScrollTop
      : document.documentElement.scrollTop
  }

  get dynamicScrollTop() {
    return this.position.scrollTop / this.position.scrollHeight * this.scrollHeight
  }

  get scrollBottom() {
    return window.scrollY + window.innerHeight
  }

  get scrollHeight() {
    return document.documentElement.scrollHeight
  }

  scrollTo(scrollTop) {
    window.scrollTo({
      top: scrollTop,
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
    scrollTop: scrollPosition.scrollTop,
    scrollBottom: scrollPosition.scrollBottom,
    scrollHeight: scrollPosition.scrollHeight,
  }
}

export function setScrollPosition(position) {
  const scrollPosition = new ScrollPosition(position)
  scrollPosition.scrollTo(scrollPosition.scrollTop)
}


