import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../reading-list/readingList.mjs'
import * as statusBar from '../status-bar/statusBar.js'


// Init history reading list from storage.
$(async () => {
  await readingList.setup()
  statusBar.setup()

  window.onbeforeunload = readingList.removeDeletedReadingItems
})
