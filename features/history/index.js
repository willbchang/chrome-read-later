import '../../modules/prototype.mjs'
import * as readingList from '../reading-list/readingList.mjs'


// Init history reading list from storage.
$(async () => {
  await readingList.setup()
})
