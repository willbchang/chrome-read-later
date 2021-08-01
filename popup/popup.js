import '../modules/prototypes/Object.mjs'
import '../modules/prototypes/localStorage.mjs'
import * as readingList from './reading-list/readingList.js'
import * as statusBar from './status-bar/statusBar.js'
import * as runtime from '../modules/chrome/runtime.mjs'


$(async () => {
    window.isHistory = false
    window.isHidingLi = false
    window.lastKey = ''
    window.port = runtime.connect()
    await readingList.setup()
    statusBar.setup()
})
