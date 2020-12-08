import * as tabs from '../modules-chrome/tabs'
import * as action from './domActions'

export function updateCountNumber() {
  action.updateRowNumber()
  action.updateTotalCount()
}

export function openHistoryPageOnClick() {
  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('history/index.html'))
  })
}