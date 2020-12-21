import * as action from '../reading-list/action.js'
import * as readingList from '../reading-list/readingList.js'

export function setup() {
  init()
  updateCountNumber()
  switchHistoryPageOnClick()
}

function init() {
  const documentUrl = 'https://github.com/willbchang/chrome-read-later#features'
  const feedbackUrl = 'https://github.com/willbchang/chrome-read-later/issues/new'
  $('#status-bar').append(`
     <li id="count"><span id="row">0</span>:<span id="total">0</span></li>
     <li id="history">History</li>
     <li id="document">
        <a href="${documentUrl}" target="_blank">Document</a>
     </li>
     <li id="feedback">
        <a href="${feedbackUrl}" target="_blank">Feedback</a>
     </li>
  `)
}

function updateCountNumber() {
  action.updateRowNumber()
  action.updateTotalNumber()
}

function switchHistoryPageOnClick() {
  $('#history').on('click', async () => {
    window.isHistoryPage = !window.isHistoryPage
    window.lastKey = ''
    await readingList.setup()
    updateCountNumber()
    window.isHistoryPage
      ? $('#history').addClass('highlight')
      : $('#history').removeClass('highlight')
  })
}