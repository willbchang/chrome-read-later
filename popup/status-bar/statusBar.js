import * as action from '../action.js'


export function setup() {
    init()
    action.updateRowNumber()
    action.updateTotalNumber()
}

function init() {
    $('#status-bar').append(`
     <li id="count" title="Row Number: Total Count">
        <span id="row">0</span>:<span id="total">0</span>
     </li>
     <li id="history" title="Reading List History">
        <img src="../../icons/history.svg">
     </li>
     <li id="info" title="Info">
        <a href="https://github.com/willbchang/chrome-read-later#readme" target="_blank">
            <img src="../../icons/info.svg"> 
        </a>
     </li>
  `)
}
