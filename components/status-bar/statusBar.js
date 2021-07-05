import * as action from '../reading-list/action.js'

export function setup() {
  init()
  updateCountNumber()
}

function init() {
  $('#status-bar').append(`
     <li id="count" title="Row Number: Total Count"><span id="row">0</span>:<span id="total">0</span></li>
     <li id="feedback"><a href="https://github.com/willbchang/chrome-read-later#readme" target="_blank">?</a></li>
  `)
}

function updateCountNumber() {
  action.updateRowNumber()
  action.updateTotalNumber()
}
