import '../modules/prototype.mjs'
import * as dom from './dom.js'
import * as storage from '../modules_chrome/storage.mjs'
import * as filter from './filter.js'

(async () => {
  // Remove the deleted urls from storage before init reading list.
  // Clear all the local items, includes dependingUrls, lastKey, and src.
  localStorage.getArray('dependingUrls').forEach(storage.remove)
  localStorage.clear()

  // Init reading list from storage.
  const ul = $('ul')
  const pages = await storage.sortByLatest()
  pages.map(page => ul.append(dom.renderListFrom(page)))

  // Focus the first li on init
  $('li')[0].focus()

  ul.on({
    mouseenter: dom.showDeleteIcon,
    mouseleave: dom.showFavIcon
  }, 'img')

  ul.on('click', event => {
    event.preventDefault()

    try {
      filter.mouseAction(event)
    } catch (e) {
      console.log('Catch click action error: ', e)
    }
  })

  $('body').on('keydown', event => {
    try {
      filter.keyAction(event)
    } catch (e) {
      console.log('Catch default key action: ', event.key)
    }
  })
})()

