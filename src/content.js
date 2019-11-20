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

function getPagePosition() {
  const position = {}
  position.scrollTop = document.documentElement.scrollTop
  position.scrollBottom = window.scrollY + window.innerHeight
  position.scrollHeight = document.documentElement.scrollHeight
  position.scrollPercent = percent(
    position.scrollBottom,
    position.scrollHeight
  )
  return position
}

function percent(x, y) {
  return Math.floor((x / y) * 100) + '%'
}
