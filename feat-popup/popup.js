import '../modules/prototype.mjs'
import * as readingList from '../feature-reading-list/readingList.mjs'
import * as statusBar from '../feature-status-bar/statusBar.js'

$(async () => {
  await readingList.setup()
  statusBar.setup()
})

