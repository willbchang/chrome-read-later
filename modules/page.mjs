// Use scrollBottom to calculate scrollPercent to avoid the situation:
// Scroll page to the bottom, but the percent is not 100%.
class ScrollPosition {
  constructor(scrolled) {
    this.scrolled = scrolled
  }

  get top() {
    return this.scrolled.height
      ? this.dynamicTop
      : document.documentElement.scrollTop
  }

  get dynamicTop() {
    return this.scrolled.top
      / this.scrolled.height
      * this.height
  }

  get height() {
    return document.documentElement.scrollHeight
  }

  get bottom() {
    return window.scrollY + window.innerHeight
  }

  set() {
    window.scrollTo({
      top: this.top,
      behavior: 'smooth'
    })
  }
}

export function getPosition() {
  // In popup.js, there is a `if` statement to check if the scrollTop is 0,
  // if it is 0, the scrollPercent won't add to popup.html.
  // Do not worry this situation: scrollTop: 0, scrollPercent: 100%
  const scrollPosition = new ScrollPosition({})
  return {
    scroll: {
      top: scrollPosition.top,
      bottom: scrollPosition.bottom,
      height: scrollPosition.height,
    },
  }
}

export function setPosition(position) {
  const scrollPosition = new ScrollPosition(position.scroll)
  scrollPosition.set()
}