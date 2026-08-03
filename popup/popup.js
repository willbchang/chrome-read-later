import '../modules/prototypes/Object.mjs'
import * as readingList from './reading-list/readingList.js'
import * as statusBar from './status-bar/statusBar.js'
import * as runtime from '../modules/chrome/runtime.mjs'
import * as storage from '../modules/chrome/storage.mjs'
import { setupTooltips } from '../modules/tooltip.mjs'

$(async () => {
    setupTooltips()
    window.isHistory = false
    window.isHidingLi = false
    window.lastKey = ''
    const options = await storage.getOptions()
    let localOverflowUrls = []

    if (options.hybrid) {
        try {
            await storage.rebalanceHybridStorage()
            localOverflowUrls = await storage.getLocalOverflowUrls()
        } catch (error) {
            console.warn('Read Later: unable to identify local overflow items.', error)
        }
    }

    await storage.session.initSessionKeys()
    window.options = options
    window.localOverflowUrls = new Set(localOverflowUrls)
    window.port = runtime.connect()
    await readingList.setup()
    statusBar.setup()
})
