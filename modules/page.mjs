// https://javascript.info/size-and-scroll-window
class ScrollPosition {
  constructor(scrolled) {
    this.scrolled = scrolled
  }

  setTop() {
    window.scrollTo({
      top: this.top,
      behavior: 'smooth'
    })
  }

  get top() {
    return this.scrolled.height
      ? this.dynamicTop
      : window.pageYOffset
  }

  get dynamicTop() {
    return this.scrolled.top
      / this.scrolled.height
      * this.height
  }

  get height() {
    return Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    )
  }

  get bottom() {
    return window.scrollY + window.innerHeight
  }
}

export function getPosition() {
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
  scrollPosition.setTop()
}
