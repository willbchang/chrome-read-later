// https://developer.chrome.com/extensions/runtime#method-sendMessage
export function sendMessage(info) {
    chrome.runtime.sendMessage(info)
}

// https://developer.chrome.com/extensions/runtime#event-onMessage
export function onMessage(callback) {
    chrome.runtime.onMessage.addListener(callback)
}

// https://developer.chrome.com/docs/extensions/reference/runtime/#method-connect
export function connect() {
    return chrome.runtime.connect()
}

// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onConnect
export function onConnect(callback) {
    chrome.runtime.onConnect.addListener(callback)
}

export function onPopupDisconnect(callback) {
    onConnect(popup => popup.onDisconnect.addListener(callback))
}

// https://developer.chrome.com/extensions/runtime#event-onInstalled
export function onInstalled(callback) {
    chrome.runtime.onInstalled.addListener(callback)
}

export function onInstall(callback) {
    onInstalled(details => {
        if (details.reason === 'install') callback()
    })
}

export function onUpdate(callback) {
    onInstalled(details => {
        if (details.reason === 'update') callback(details)
    })
}

export function createNotification(title, message) {
    const options = {
        type:    'basic',
        title,
        message,
        iconUrl: '../../icons/logo-orange128x128.png',
    }
    chrome.notifications.create(options)
}

export function getCurrentVersion() {
    return chrome.runtime.getManifest().version
}