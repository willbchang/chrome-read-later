chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.info === 'get position')
    sendResponse(getPosition())

  if (message.scrollTop)
    window.scrollTo({
      top: message.scrollTop,
      behavior: 'smooth'
    })
})

// Use scrollBottom to calculate scrollPercent to avoid the situation: 
// Scroll page to the bottom, but the percent is not 100%.
function getPosition() {
  // In popup.js, there is a `if` statement to check if the scrollTop is 0,
  // if it is 0, the scrollPercent won't add to popup.html.
  // Do not worry this situation: scrollTop: 0, scrollPercent: 100%
  return {
    scrollTop: document.documentElement.scrollTop,
    scrollPercent: percent(
      window.scrollY + window.innerHeight, // scrollBottom
      document.documentElement.scrollHeight
    )
  }
}

function percent(x, y) {
  return Math.floor((x / y) * 100) + '%'
}
