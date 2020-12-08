import * as tabs from '../modules-chrome/tabs.mjs'
import * as action from '../modules/domActions.mjs'

export function setup() {
  updateCountNumber()
  openHistoryPageOnClick()
}

export function updateCountNumber() {
  action.updateRowNumber()
  action.updateTotalNumber()
}

export function openHistoryPageOnClick() {
  $('#history').on('click', async () => {
    await tabs.create(chrome.runtime.getURL('feature-history/index.html'))
  })
}