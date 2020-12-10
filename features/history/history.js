import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../reading-list/readingList.mjs'
import * as statusBar from '../status-bar/statusBar.js'

// window.onload = readingList.removeDeletedReadingItems
// Init history reading list from storage.
$(async () => {
  window.isLocal = readingList.isLocal()
  await readingList.setup()
  statusBar.setup()
})
