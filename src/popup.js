import {renderHtmlList} from '../modules/data.mjs'
import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'

initReadingList().then(() => {
  $('ul').on('click', 'a', sendUrlToBackground)
    .on({mouseenter: showDeleteIcon, mouseleave: showFavIcon}, 'img')
    .on('click', 'img', removeReadingItem)
})

async function initReadingList() {
  const pages = await storage.sortByLatest()
  pages.map(page => $('ul').append(renderHtmlList(page)))
}

function sendUrlToBackground(event) {
  // https://devdocs.io/jquery/event.preventdefault
  event.preventDefault()
  // Send clicked url as message to background,
  // because there are async/await functions,
  // popup.html will disappear after clicking the link,
  // thus popup.js will be interrupted.
  // `event.target.parentNode.href` is for
  // clicking the long word in <a>, it is contained by <span>.
  extension.sendMessage({url: event.target.href || event.target.parentNode.href})
  // Close popup.html when loading in current tab.
  // Update current tab won't close popup.html automatically,
  // but create a new tab does.
  window.close()
}

function showDeleteIcon(event) {
  localStorage.setItem('src', $(event.target).attr('src'))
  $(event.target).attr('src', '../images/32x32delete.png')
}

function showFavIcon(event) {
  $(event.target).attr('src', localStorage.getItem('src'))
  localStorage.clear()
}

function removeReadingItem(event) {
  // Current `event.target` is <img>, the parentNode is <li>
  $(event.target.parentNode).remove()
  // The next sibling of <img> is <a>
  storage.remove(event.target.nextElementSibling.href)
}
