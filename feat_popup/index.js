import * as html from './virtualDom.js'
import * as storage from '../modules_chrome/storage.mjs'
import * as dispatch from './dispatch.js'
import * as local from './localStorage.mjs'

(async () => {
  local.getArray('dependingUrls').forEach(storage.remove)
  localStorage.removeItem('dependingUrls')

  // Init reading list
  const ul = $('ul')
  const pages = await storage.sortByLatest()
  pages.map(page => ul.append(html.renderListFrom(page)))

  // Listen mouse and keys events
  ul.on({mouseenter: showDeleteIcon, mouseleave: showFavIcon}, 'img')
    .on('click', dispatch.click)
    .on('keydown', dispatch.keydown)

  $('li')[0].focus()

  localStorage.removeItem('lastKey')
  localStorage.removeItem('src')
})()

function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../assets/icons/delete-white32x32.png' : '../assets/icons/delete-black32x32.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
}

