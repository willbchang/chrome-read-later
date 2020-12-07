import '../modules/prototype.mjs'
import * as generator from '../modules/readingItemGenerator.mjs'
import * as storage from '../modules-chrome/storage.mjs'
import * as tabs from '../modules-chrome/tabs.mjs'
import * as action from '../modules/domActions.mjs'
import * as dom from '../modules/domEvents.mjs'
import * as keyboard from '../modules/keyboard.mjs'
import {mouseAction} from '../modules/mouse.mjs'
import * as mouse from '../modules/mouse.mjs'

$(async () => {
  // Remove the deleted urls from storage before init reading list.
  // Clear all the local items, includes dependingUrls, lastKey, and src.
  localStorage.getArray('dependingUrls').forEach(storage.sync.remove)
  const localStorageKeys = ['dependingUrls', 'lastKey', 'isMoving']
  localStorageKeys.forEach(key => localStorage.removeItem(key))

  // Init reading list from storage.
  const readingList = $('#reading-list')
  const pages = await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))

  // Focus the first li on init
  const li = $('#reading-list li')
  if (li.length !== 0) li.first().addClass('active')

  // Count the reading list
  action.updateRowNumber()
  action.updateTotalCount()

  readingList.on({
    mouseenter: dom.showDeleteIcon,
    mouseleave: dom.showFavIcon
  }, 'img')

  mouse.updateStateOnMouseMove()

  readingList.on('click', event => {
    event.preventDefault()

    try {
      mouseAction(event)
    } catch (e) {
      console.log('Catch click action error: ', e)
    }
  })

  keyboard.doActionOnKeyDown()

  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('history/index.html'))
  })
})

