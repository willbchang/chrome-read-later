(async () => {
  const src = chrome.runtime.getURL('modules/data.mjs')
  const data = await import(src)

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.info === 'get position')
      sendResponse(data.getPagePosition())

    if (message.scrollTop)
      window.scrollTo({
        top: message.scrollTop,
        behavior: 'smooth'
      })
  })
})()

