chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const data = await importModule('modules/data.mjs')
    if (message.info === 'get position')
      sendResponse(data.getScrollPosition())
    setPagePosition(message)
  })()
  return true
})

async function importModule(url) {
  const src = chrome.runtime.getURL(url)
  return await import(src)
}

function setPagePosition(message) {
  if (message.scrollTop)
    window.scrollTo({
      top: message.scrollTop,
      behavior: 'smooth'
    })
}