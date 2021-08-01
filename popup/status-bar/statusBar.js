import * as action from '../action.js'


export function setup() {
    init()
    action.updateRowNumber()
    action.updateTotalNumber()
    $('#history img').on('click', () => action.history())
}

function init() {
    $('#status-bar').append(`
     <li id="count" title="Row Number: Total Count">
        <span id="row">0</span>:<span id="total">0</span>
     </li>
     <li title="Reading List History">
        <img id="history" src="../../icons/history.svg">
     </li>
     <li id="info" title="Info">
        <a href="https://github.com/willbchang/chrome-read-later#readme" target="_blank">
            <img src="../../icons/info.svg"> 
        </a>
     </li>
  `)
}
