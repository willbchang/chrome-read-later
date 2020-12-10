import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../../features/reading-list/readingList.mjs'
import * as statusBar from '../../features/status-bar/statusBar.js'

$(async () => {
  window.isLocal = readingList.isLocal()
  await readingList.setup()
  statusBar.setup()
})

