import * as action from '../action.js'
import * as filter from '../filter.js'

export function setup () {
    init()
    action.updateRowNumber()
    action.updateTotalNumber()
    $('#status-bar').on('click', event => {
        const clickType = filter.getClickType(event, 'statusBar')
        const clickAction = filter.getClickAction(clickType)
        clickAction && clickAction()
    })
}

function init () {
    $('#status-bar').append(`
     <li id="count" title="Row Number: Total Count">
        <span id="row">0</span>:<span id="total">0</span>
     </li>
     <li title="Reading List History">
        <img id="history" src="../../icons/history.svg">
     </li>
     <li title="Click to open option page">
        <img id="options" src="../../icons/options.svg">
     </li>
     <li title="Have any question? Click to get document and send feedback">
        <img id="question" src="../../icons/question.svg"> 
     </li>
  `)
}
