import * as extension from '../modules/extension.mjs'
import * as storage from '../modules/storage.mjs'
import {createReadingItem} from '../modules/data.mjs'


initReadingList().then(() => {
  $('ul').on('click', 'a', sendUrlToBackground)
    .on({mouseenter: showDeleteIcon, mouseleave: showFavIcon}, 'img')
    .on('click', 'img', removeItem)
})

async function initReadingList() {
  const pages = await storage.sortByReversedDate()
  pages.map(page => $('ul').append(createReadingItem(page)))
}

function sendUrlToBackground(e) {
  // Disable the default <a> tag action,
  // because there are some actions need to be run:
  //  - Check if current tab is empty: tabs.isEmpty()
  //  - Add tab loading status listener: tabs.onComplete()
  //  - Get saved page scroll position: storage.getPosition()
  //  - Send position to content.js: tabs.sendMessage()
  //  - Remove this item in storage: storage.remove()
  e.preventDefault()
  // Send clicked url as message to background.
  // Because tabs.onComplete() is a live listener,
  // popup.html will disappeared after clicking the link,
  // thus the listener in popup.js would be interrupted.
  // `e.target.parentNode.href` is for the case when url is title,
  // to break the long 'word', the whole title is contained by <span>.
  // Please check getReadingListFrom() and breakLongWord() in data.mjs
  extension.sendMessage({url: e.target.href || e.target.parentNode.href})
  // Close popup.html when loading in current tab,
  // because tabs.update() won't close popup.html automatically,
  // tabs.create() does.
  window.close()
}

function showDeleteIcon(e) {
  localStorage.setItem('src', $(e.target).attr('src'))
  $(e.target).attr('src', '../images/32x32delete.png')
}

function showFavIcon(e) {
  $(e.target).attr('src', localStorage.getItem('src'))
  localStorage.clear()
}

function removeItem(e) {
  // e.target is <img>, the parentNode is <li>
  $(e.target.parentNode).remove()
  // The next sibling of <img> is <a>
  storage.remove(e.target.nextElementSibling.href)
}
