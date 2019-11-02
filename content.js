chrome.runtime.onMessage.addListener(
  function (request, sender, send) {
    send(document.documentElement.scrollTop || 0)
  }
)
