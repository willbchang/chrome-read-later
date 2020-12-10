import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../reading-list/readingList.mjs'
import * as statusBar from '../status-bar/statusBar.js'

// Init history reading list from storage.
$(async () => {
  window.isHistoryPage = true
  window.isHidingLi = false
  window.lastKey = ''
  await readingList.setup()
  statusBar.setup()
})
