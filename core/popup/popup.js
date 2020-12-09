import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../../features/reading-list/readingList.mjs'
import * as statusBar from '../../features/status-bar/statusBar.js'

$(async () => {
  await readingList.setup()
  statusBar.setup()
  window.onbeforeunload = readingList.removeDeletedReadingItems
})

