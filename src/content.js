chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.info === 'get page position')
    sendResponse(getPagePosition())

  if (message.scrollTop) {
    window.scrollTo({
      top: message.scrollTop,
      behavior: 'smooth'
    })
  }
})

// Use scrollBottom to calculate scrollPercent to avoid the situation: 
// Scroll page to the bottom, but the percent is not 100%.
function getPagePosition() {
  const position = Object.assign({
    scrollTop: document.documentElement.scrollTop,
    scrollPercent: percent(
      window.scrollY + window.innerHeight, // scrollBottom
      document.documentElement.scrollHeight
    )
  })
  return position
}

function percent(x, y) {
  return Math.floor((x / y) * 100) + '%'
}
