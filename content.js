chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.info === 'get page position') {
    const position = {}
    position.scrollTop = document.documentElement.scrollTop
    position.scrollBottom = window.scrollY + window.innerHeight
    position.scrollHeight = document.documentElement.scrollHeight
    sendResponse(position)
  }

  if (message.scrollTop) {
    document.documentElement.scrollTop = message.scrollTop
  }
})
