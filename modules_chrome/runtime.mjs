// https://developer.chrome.com/extensions/runtime#method-sendMessage
export function sendMessage(info) {
  chrome.runtime.sendMessage(info)
}

// https://developer.chrome.com/extensions/runtime#event-onMessage
export function onMessage(callback) {
  chrome.runtime.onMessage.addListener(callback)
}

// https://developer.chrome.com/extensions/runtime#event-onInstalled
export function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'install') callback()
    if (details.reason === 'update') createNotification(
      chrome.runtime.getManifest().name + ' Updated!',
      `From V${details.previousVersion} updated to V${chrome.runtime.getManifest().version}`
    )
  })
}

export function createNotification(title, message) {
  const options = {
    type: 'basic',
    title,
    message,
    iconUrl: '../images/logo-orange128x128.png',
  }
  chrome.notifications.create(options)
}
