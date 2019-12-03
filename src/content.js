(async () => {
  const data = await importModule('modules/data.mjs')

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.info === 'get position')
      sendResponse(data.getPagePosition())
    setPagePosition(message)
  })
})()

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