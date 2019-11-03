chrome.runtime.onMessage.addListener(
  function (request, sender, send) {
    if (request.info === "save")
      send(document.documentElement.scrollTop || 0)
  }
)
