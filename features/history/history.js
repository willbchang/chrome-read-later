import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../reading-list/readingList.mjs'
import * as statusBar from '../status-bar/statusBar.js'

// Init history reading list from storage.
$(async () => {
  window.isLocal = isHistory()
  window.isMoving = false
  window.lastKey = ''
  await readingList.setup()
  statusBar.setup()
})

// Get the script file path and check if it's in history/
function isHistory() {
  return $('script')
    .filter((_, script) =>
      script.src.includes('history/')
    )
    .length !== 0
}
