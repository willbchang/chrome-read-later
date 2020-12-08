import * as tabs from '../../modules-chrome/tabs.mjs'
import * as action from '../../modules/domActions.mjs'

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
    await tabs.create(chrome.runtime.getURL('features/history/index.html'))
  })
}