import * as tabs from '../../modules/chrome/tabs.mjs'
import * as action from '../reading-list/action.js'
import * as readingList from '../reading-list/readingList.js'

export function setup() {
  init()
  updateCountNumber()
  switchHistoryPageOnClick()
}

function init() {
  $('#status-bar').append(`
     <li id="count"><span id="row">0</span>:<span id="total">0</span></li>
     ${window.isHistoryPage ? '' : '<li id="history"><a href="#">History</a></li>'}
     <li id="document"><a href="https://github.com/willbchang/chrome-read-later#features" target="_blank">Document</a>
     </li>
     <li id="feedback"><a href="https://github.com/willbchang/chrome-read-later/issues/new" target="_blank">Feedback</a>
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
  })
}