import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../../features/reading-list/readingList.js'
import * as statusBar from '../../features/status-bar/statusBar.js'

$(async () => {
  window.isHistoryPage = false
  window.isHidingLi = false
  window.lastKey = ''
  await readingList.setup()
  statusBar.setup()
})

