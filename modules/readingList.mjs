// Init reading list from storage.
import * as storage from '../modules-chrome/storage.mjs'
import * as generator from './readingItemGenerator.mjs'
import * as dom from './domEvents.mjs'

const readingList = $('#reading-list')

export async function init() {
  const pages = await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))
}


export function changeIconOnMouseEnterLeave() {
  readingList.on({
    mouseenter: dom.showDeleteIcon,
    mouseleave: dom.showFavIcon
  }, 'img')
}