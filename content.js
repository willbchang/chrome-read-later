chrome.runtime.onMessage.addListener((request, sender, send) => {
  if (request.info === 'save') {
    const position = {}
    position.scrollTop = document.documentElement.scrollTop
    position.scrollBottom = window.scrollY + window.innerHeight
    position.scrollHeight = document.documentElement.scrollHeight
    send(position)
  }
  if (request.url) {
    console.log(request.url)
  }
})
