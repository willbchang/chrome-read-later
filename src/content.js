chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const page = await dynamicImport('modules/page.mjs')
    if (message.info === 'get position') sendResponse(page.getPosition())
    if (message.info === 'set position') page.setPosition(message)
  })()
  return true
})

async function dynamicImport(url) {
  const src = chrome.runtime.getURL(url)
  return await import(src)
}
