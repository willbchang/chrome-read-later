import * as storage from '../../modules/chrome/storage.mjs'
import * as generator from './readingItemGenerator.js'
import * as action from './action.js'
import * as filter from './filter.js'

const readingList = $('#reading-list')

export async function setup() {
  resetEventListeners()
  await removeDeletedReadingItems()
  await initDomFromStorage()
  activeLastActivatedLi()
  changeIconOnMouseEnterLeave()
  updateStateOnMouseMove()
  doActionOnMouseClick()
  doActionOnBodyKeyDown()
}

function resetEventListeners() {
  // Remove all events listeners
  readingList.off()
  $('body').off()
}

// Remove the deleted urls from storage before init reading list.
// Clear all the local items, includes dependingUrls and src.
export async function removeDeletedReadingItems() {
  if (window.isHistoryPage) {
    // for..of and await make removeHistory work on reload history page.
    for (const url of localStorage.getArray('deletedLocalUrls')) {
      await storage.local.removeHistory(url)
    }
    return localStorage.removeItem('deletedLocalUrls')
  }
  localStorage.getArray('deletedSyncUrls').forEach(storage.sync.remove)
  localStorage.removeItem('deletedSyncUrls')
}

async function initDomFromStorage() {
  const pages = window.isHistoryPage
    ? await storage.local.sortHistoryByLatest()
    : await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  const oldReadingItemsLength = readingList.children().length

  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))

  // This way improve the UX, readingList.empty() will flash the screen.
  readingList.children().slice(0, oldReadingItemsLength).remove()
}

function activeLastActivatedLi() {
  const lastActivatedLiId = localStorage.getItem(
    `${window.isHistoryPage ? 'local' : 'sync'}ActivatedLiId`
  )

  const li = lastActivatedLiId
    ? $(`#${lastActivatedLiId}`)
    : $('#reading-list li').first()

  if (li.length !== 0) {
    action.reactive(li)
    action.scrollTo(li, 0)
  }
}

function changeIconOnMouseEnterLeave() {
  readingList.on({
    mouseenter: showDeleteIcon,
    mouseleave: showFavIcon
  }, 'img')
}

function updateStateOnMouseMove() {
  readingList.on('mousemove', 'li', ({target}) => {
    const li = target.tagName === 'LI' ? $(target) : $(target.parentNode)
    action.reactive(li)
    action.updateRowNumber()
  })
}

function doActionOnMouseClick() {
  readingList.on('click', event => {
    event.preventDefault()

    try {
      const modifiedClick = filter.getModifiedClick(event)
      const clickAction = filter.getClickAction(modifiedClick, event.target.tagName)
      clickAction()
    } catch (e) {
      console.log('Catch click action error: ', e, event.target.tagName)
    }
  })
}

function doActionOnBodyKeyDown() {
  $('body').on('keydown', event => {
    try {
      const keyBinding = filter.getKeyBinding(event)
      const keyAction = filter.getKeyAction(keyBinding)
      keyAction()
    } catch (e) {
      console.log('Catch default key action: ', e, event.key, event.target.tagName)
    }
  })
}

function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../../assets/icons/delete-white32x32.png' : '../../assets/icons/delete-black32x32.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
}