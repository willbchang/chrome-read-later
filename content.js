chrome.runtime.onMessage.addListener(
  function (request, sender, send) {
    if (request.info === "save")
      send({
        scrollTop: document.documentElement.scrollTop,
        scrollHeight: document.documentElement.scrollHeight
      })
  }
)
