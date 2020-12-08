import '../modules/prototype.mjs'
import * as readingList from '../modules/readingList.mjs'
import * as statusBar from '../modules/statusBar.js'

$(async () => {
  await readingList.setup()

  statusBar.openHistoryPageOnClick()

})

