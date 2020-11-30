import '../modules/prototype.mjs'
import * as dom from './dom.js'
import * as storage from '../modules-chrome/storage.mjs'
import * as filter from './filter.js'
import * as action from './action.js'

(async () => {
  // Remove the deleted urls from storage before init reading list.
  // Clear all the local items, includes dependingUrls, lastKey, and src.
  localStorage.getArray('dependingUrls').forEach(storage.sync.remove)
  localStorage.clear()

  // Init reading list from storage.
  const ul = $('#reading-list')
  const pages = await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  pages.map(page => ul.append(
    dom.renderListFrom(page, favIcons[page.favIconUrl])
  ))

  // Focus the first li on init
  const li = $('#reading-list li')
  if (li.length !== 0) li.first().addClass('active')

  // Count the reading list
  $('#total').text(pages.length)
  $('#row').text($('.active').index() + 1)

  ul.on({
    mouseenter: dom.showDeleteIcon,
    mouseleave: dom.showFavIcon
  }, 'img')

  // Focus on li when mouse move, do the same behavior like keyboard navigation
  ul.on('mousemove', 'li', ({target}) => {
    // Empty selection on mouse move.
    document.getSelection().empty()
    const li = target.tagName === 'LI' ? $(target) : $(target.parentNode)
    action.reactive(li)
  })

  let selections = []
  document.addEventListener('selectionchange', () => {
    selections.push(document.getSelection().toString())
  })

  ul.on('click', event => {
    event.preventDefault()
    // Right click will give 2 selection history
    // This prevents open link after selecting text.
    if (selections.length > 2) return selections = []

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

