// Use scrollBottom to calculate scrollPercent to avoid the situation:
// Scroll page to the bottom, but the percent is not 100%.
export function getScrollPosition() {
  // In popup.js, there is a `if` statement to check if the scrollTop is 0,
  // if it is 0, the scrollPercent won't add to popup.html.
  // Do not worry this situation: scrollTop: 0, scrollPercent: 100%
  return {
    scrollTop: getScrollTop(),
    scrollBottom: getScrollBottom(),
    scrollHeight: getScrollHeight(),
  }

  function getScrollTop() {
    return document.documentElement.scrollTop
  }

  function getScrollBottom() {
    return window.scrollY + window.innerHeight
  }

  function getScrollHeight() {
    return document.documentElement.scrollHeight
  }
}

export function setScrollPosition({scrollTop}) {
  window.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
}
