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
     <li id="count" tabindex="0" aria-label="Reading list count">
        <span id="row">0</span>:<span id="total">0</span>
     </li>
     <li tabindex="0" data-tooltip="Reading list history"
         aria-label="Reading list history">
        <img id="history" src="../../icons/history.svg">
     </li>
     <li tabindex="0" data-tooltip="Export reading list"
         aria-label="Export reading list">
        <img id="export" src="../../icons/export.svg">
     </li>
     <li tabindex="0" data-tooltip="Import reading list"
         aria-label="Import reading list">
        <img id="import" src="../../icons/import.svg">
     </li>
     <li tabindex="0" data-tooltip="Options"
         aria-label="Options">
        <img id="options" src="../../icons/options.svg">
     </li>
     <li tabindex="0"
         data-tooltip="Help and feedback" aria-label="Help and feedback">
        <img id="question" src="../../icons/question.svg"> 
     </li>
  `)
}
