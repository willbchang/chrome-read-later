import {getPagePosition} from '../modules/data.mjs'

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.info === 'get position')
    sendResponse(getPagePosition())

  if (message.scrollTop)
    window.scrollTo({
      top: message.scrollTop,
      behavior: 'smooth'
    })
})
