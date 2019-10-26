function onInstalled(callback) {
  chrome.runtime.onInstalled.addListener(callback)
}

function onCommand(callback) {
  chrome.commands.onCommand.addListener(callback)
}

export { onInstalled, onCommand }
