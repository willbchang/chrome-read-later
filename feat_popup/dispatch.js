import * as action from './action.js'
import * as filter from './filter.js'

export const keydown = event => {
  try {
    filter.keyAction(event)
  } catch (e) {
    console.log('Catch default keys action: ', event.key)
  }
}


export const click = event => {
  event.preventDefault()

  event.target.tagName === 'IMG'
    ? action.remove(event.target)
    : action.open(event)
}
