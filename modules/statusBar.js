import * as tabs from '../modules-chrome/tabs'

export function openHistoryPageOnClick() {
  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('history/index.html'))
  })
}