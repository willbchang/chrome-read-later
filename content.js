chrome.runtime.onMessage.addListener(function(request, sender, send) {
  if (request.info === 'save') {
    const position = {}
    position.scroll = {}
    position.scroll.top = document.documentElement.scrollTop
    position.scroll.bottom = window.scrollY + window.innerHeight
    position.scroll.height = document.documentElement.scrollHeight
    send(position)
  }
})
