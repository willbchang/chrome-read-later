import '../modules/prototype.mjs'
import * as tabs from '../modules-chrome/tabs.mjs'
import * as readingList from '../modules/readingList.mjs'

$(async () => {
  await readingList.setup()


  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('history/index.html'))
  })
})

