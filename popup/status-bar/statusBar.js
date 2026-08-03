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
    const archive = window.options?.archiveMode
        ? `<li tabindex="0" data-tooltip="Open reading list archive"
               aria-label="Open reading list archive">
              <img id="archive" src="../../icons/archive.svg">
           </li>`
        : ''

    $('#status-bar').append(`
     <li id="count" tabindex="0" aria-label="Reading list count">
        <span id="row">0</span>:<span id="total">0</span>
     </li>
     ${archive}
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
