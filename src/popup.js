import * as extension from '../modules/extension.mjs'
import * as storage from '../modules/storage.mjs'
import * as data from '../modules/data.mjs'

initReadingList().then(() => {
  $('ul').on('click', 'a', sendUrlToBackground)
    .on({mouseenter: showDeleteIcon, mouseleave: showFavIcon}, 'img')
    .on('click', 'img', removeItem)
})

async function initReadingList() {
  const pages = await storage.sortByLatest()
  pages.map(page => $('ul').append(data.renderHtmlText(page)))
}

function sendUrlToBackground(event) {
  // Disable the default <a> tag action,
  // because there are some actions need to be run:
  //  - Check if current tab is empty: tabs.isEmpty()
  //  - Add tab loading status listener: tabs.onComplete()
  //  - Get saved page scroll position: storage.getPosition()
  //  - Send position to content.js: tabs.sendMessage()
  //  - Remove this item in storage: storage.remove()
  event.preventDefault()
  // Send clicked url as message to background.
  // Because tabs.onComplete() is a live listener,
  // popup.html will disappeared after clicking the link,
  // thus the listener in popup.js would be interrupted.
  // `event.target.parentNode.href` is for the case when url is title,
  // to break the long 'word', the whole title is contained by <span>.
  // Please check getReadingListFrom() and breakLongWord() in data.mjs
  extension.sendMessage({url: event.target.href || event.target.parentNode.href})
  // Close popup.html when loading in current tab,
  // because tabs.update() won't close popup.html automatically,
  // tabs.create() does.
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

function removeItem(event) {
  // event.target is <img>, the parentNode is <li>
  $(event.target.parentNode).remove()
  // The next sibling of <img> is <a>
  storage.remove(event.target.nextElementSibling.href)
}
