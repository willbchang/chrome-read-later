import * as storage from '../modules-chrome/storage.mjs'
import * as dom from '../feat-popup/dom.js'


// Init history reading list from storage.
document.addEventListener('DOMContentLoaded', async () => {
  const readingList = $('#reading-list')
  const pages = await storage.local.sortHistoryByLatest()
  console.log(pages, pages[0])
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    dom.renderListFrom(page, favIcons[page.favIconUrl])
  ))
})
