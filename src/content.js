chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const page = await importModule('modules/page.mjs')
    if (message.info === 'get position')
      sendResponse(page.getScrollPosition())
    if (message.scrollTop)
      page.setScrollPosition(message)
  })()
  return true
})

async function importModule(url) {
  const src = chrome.runtime.getURL(url)
  return await import(src)
}
