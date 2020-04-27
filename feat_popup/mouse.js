import * as action from './action.js'

const dispatchClick = event => {
  event.preventDefault()

  event.target.tagName === 'IMG'
    ? action.remove(event.target)
    : action.open(event.target)
}

export default dispatchClick
