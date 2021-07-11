import * as action from '../reading-list/action.js'
import * as readingList from '../reading-list/readingList.js'
import * as runtime from '../../modules/chrome/runtime.mjs'


export function setup() {
  init()
  updateCountNumber()
  changeStatusOnClick()
}

function init() {
  $('#status-bar').append(`
     <li id="count" title="Row Number: Total Count">
        <span id="row">0</span>:<span id="total">0</span>
     </li>
     <li id="history" title="Reading List History">
        <img src="../../assets/icons/history.svg">
     </li>
     <li id="info" title="Info">
        <a href="https://github.com/willbchang/chrome-read-later#readme" target="_blank">
            <img src="../../assets/icons/info.svg"> 
        </a>
     </li>
  `)
}

function updateCountNumber() {
  action.updateRowNumber()
  action.updateTotalNumber()
}

function changeStatusOnClick() {
  const history = $('#history img')
  history.on('click', async () => {
    window.isHistory = !window.isHistory
    window.lastKey = ''
    window.port.disconnect()
    window.port = runtime.connect()
    await readingList.setup()
    updateCountNumber()
    window.isHistory
        ? history.addClass('highlight')
        : history.removeClass('highlight')
  })
}
