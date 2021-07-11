import * as action from '../reading-list/action.js'

export function setup() {
  init()
  updateCountNumber()
}

function init() {
  $('#status-bar').append(`
     <li id="count" title="Row Number: Total Count"><span id="row">0</span>:<span id="total">0</span></li>
     <li id="history" title="Reading List History">
        <img src="../../assets/icons/history.svg">
     </li>
     <li id="info">
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
