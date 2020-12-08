import * as tabs from '../modules-chrome/tabs'
import * as action from './domActions'

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