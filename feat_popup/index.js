import '../modules/prototype.mjs'
import * as dom from './dom.js'
import * as storage from '../modules_chrome/storage.mjs'
import * as dispatch from './dispatch.js'

(async () => {
  localStorage.getArray('dependingUrls').forEach(storage.remove)
  localStorage.clear()

  // Init reading list
  const ul = $('ul')
  const pages = await storage.sortByLatest()
  pages.map(page => ul.append(dom.renderListFrom(page)))

  // Listen mouse and keys events
  ul.on({
    mouseenter: dom.showDeleteIcon,
    mouseleave: dom.showFavIcon
  }, 'img')
    .on('click', dispatch.click)
  $('body').on('keydown', dispatch.keydown)

  $('li')[0].focus()
})()

