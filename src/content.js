chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const data = await importModule('modules/data.mjs')
    if (message.info === 'get position')
      sendResponse(data.getScrollPosition())
    if (message.scrollTop)
      setScrollPosition(message)
  })()
  return true
})

async function importModule(url) {
  const src = chrome.runtime.getURL(url)
  return await import(src)
}

function setScrollPosition({scrollTop, scrollHeight}) {
  window.scrollTo({
    top: scrollTop,
    behavior: 'smooth'
  })
}