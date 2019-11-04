chrome.runtime.onMessage.addListener(
  function (request, sender, send) {
    if (request.info === "save") {
      const position = {}
      position.scrollTop = document.documentElement.scrollTop
      position.scrollHeight = document.documentElement.scrollHeight
      send(position)
    }
  }
)
