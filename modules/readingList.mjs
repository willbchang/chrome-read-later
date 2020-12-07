// Init reading list from storage.
import * as storage from '../modules-chrome/storage.mjs'
import * as generator from './readingItemGenerator.mjs'

const readingList = $('#reading-list')

export async function init() {
  const pages = await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))
}
