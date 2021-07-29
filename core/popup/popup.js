import '../../modules/prototypes/Object.mjs'
import '../../modules/prototypes/localStorage.mjs'
import * as readingList from '../../components/reading-list/readingList.js'
import * as statusBar from '../../components/status-bar/statusBar.js'
import * as runtime from '../../modules/chrome/runtime.mjs'
import * as action from '../../components/reading-list/action.js'


$(async () => {
    window.isHistory = false
    window.isHidingLi = false
    window.lastKey = ''
    window.port = runtime.connect()
    await readingList.setup()
    statusBar.setup()
    changeStatusOnClick()
})


function changeStatusOnClick() {
    const history = $('#history img')
    history.on('click', async () => {
        window.isHistory = !window.isHistory
        window.lastKey = ''
        window.port.disconnect()
        window.port = runtime.connect()
        await readingList.setup()
        action.updateRowNumber()
        action.updateTotalNumber()
        window.isHistory
            ? history.addClass('highlight')
            : history.removeClass('highlight')
    })
}

