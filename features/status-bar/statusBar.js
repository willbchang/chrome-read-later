import * as tabs from '../../modules/chrome/tabs.mjs'
import * as action from '../reading-list/action.js'

export function setup() {
  updateCountNumber()
  openHistoryPageOnClick()
}

function updateCountNumber() {
  action.updateRowNumber()
  action.updateTotalNumber()
}

function openHistoryPageOnClick() {
  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('features/history/history.html'))
  })
}