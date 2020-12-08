import '../modules/prototype.mjs'
import * as storage from '../modules-chrome/storage.mjs'
import * as tabs from '../modules-chrome/tabs.mjs'
import * as readingList from '../modules/readingList.mjs'

$(async () => {
  // Remove the deleted urls from storage before init reading list.
  // Clear all the local items, includes dependingUrls, lastKey, and src.
  localStorage.getArray('dependingUrls').forEach(storage.sync.remove)
  const localStorageKeys = ['dependingUrls', 'lastKey', 'isMoving']
  localStorageKeys.forEach(key => localStorage.removeItem(key))

  await readingList.initDomFromStorage()
  readingList.updateStatusBar()
  readingList.activeFirstLi()
  readingList.changeIconOnMouseEnterLeave()
  readingList.updateStateOnMouseMove()
  readingList.doActionOnMouseClick()
  readingList.doActionOnBodyKeyDown()


  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('history/index.html'))
  })
})

