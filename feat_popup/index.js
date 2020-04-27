import * as html from './htmlRender.mjs'
import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'


(async () => {
  // Init reading list
  const ul = $('ul')
  const pages = await storage.sortByLatest()
  pages.map(page => ul.append(html.renderListFrom(page)))

  // Listen mouse and keyboard events
  ul.on({mouseenter: showDeleteIcon, mouseleave: showFavIcon}, 'img')
    .on('click', performAction)
    .on('keydown', listenOnKeyboard)
})()

function performAction(event) {
  // https://devdocs.io/jquery/event.preventdefault
  event.preventDefault()
  // Get and send reading item's url as message to background,
  // because they are async/await functions,
  // index.html will disappear after clicking the link,
  // thus index.js will be interrupted.

  if (event.target.tagName === 'IMG') return removeReadingItem(event)
  sendUrlToBackground(event)
  // Close index.html when loading in current tab.
  // Update current tab won't close index.html automatically,
  // but create a new tab does.
  // window.close()
}

function listenOnKeyboard(event) {
  const keyboardActions = {
    Enter: () => sendUrlToBackground(event),
    Backspace: () => removeReadingItem(event),
  }

  try {
    keyboardActions[event.key]()
  } catch (e) {
    console.log('Catch default keyboard action: ', event.key)
  }
}

function sendUrlToBackground(event) {
  const urlStore = {
    A: () => event.target.href,
    LI: () => event.target.childNodes[3].href,
    SPAN: () => event.target.previousSibling.previousSibling.href,
  }

  extension.sendMessage({url: urlStore[event.target.tagName]()})
}

function removeReadingItem(event) {
  const urlStore = {
    LI: () => event.target.childNodes[3].href,
    IMG: () => event.target.nextElementSibling.href
  }

  const removeActions = {
    LI: () => event.target.remove(),
    IMG: () => event.target.parentNode.remove(),
  }

  storage.remove(urlStore[event.target.tagName]())
  removeActions[event.target.tagName]()
}

function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../assets/icons/delete-white32x32.png' : '../assets/icons/delete-black32x32.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
  localStorage.clear()
}

