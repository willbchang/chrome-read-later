// https://developer.chrome.com/apps/runtime#event-onMessage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const page = await dynamicImport('feat_content/pagePosition.mjs')
    if (message.info === 'get position') sendResponse(page.getPosition())
    if (message.info === 'set position') page.setPosition(message)
  })()

  // Return true in onMessage will wait the async function.
  return true
})

async function dynamicImport(url) {
  const src = chrome.runtime.getURL(url)
  return await import(src)
}
