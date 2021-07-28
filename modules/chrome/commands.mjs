// https://developer.chrome.com/extensions/commands#event-onCommand
// Promise only fired once, it's not suit able to this kind of listener.
// Unlike tabs.onComplete(), commands.onCommand() is a one-time setup.
export function onCommand(callback) {
    chrome.commands.onCommand.addListener(callback)
}
