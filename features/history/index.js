import * as storage from '../../modules-chrome/storage.mjs'
import * as generator from '../../feature-reading-list/readingItemGenerator.mjs'


// Init history reading list from storage.
$(async () => {
  const readingList = $('#reading-list')
  const pages = await storage.local.sortHistoryByLatest()
  console.log(pages, pages[0])
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))
})
