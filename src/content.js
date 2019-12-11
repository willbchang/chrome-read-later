chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const page = await dynamicImport('modules/page.mjs')
    if (message.info === 'get position') sendResponse(page.getScrollPosition())
    if (message.info === 'set position') page.setScrollPosition(message)
  })()
  return true
})

async function dynamicImport(url) {
  const src = chrome.runtime.getURL(url)
  return await import(src)
}
