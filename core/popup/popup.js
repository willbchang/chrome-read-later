import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../../components/reading-list/readingList.js'
import * as statusBar from '../../components/status-bar/statusBar.js'
import * as runtime from '../../modules/chrome/runtime.mjs'


$(async () => {
  window.isHidingLi = false
  window.lastKey = ''
  runtime.connect()
  await readingList.setup()
  statusBar.setup()
})

