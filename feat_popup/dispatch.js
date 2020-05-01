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

  try {
    filter.mouseAction(event)
  } catch (e) {
    console.log('Catch click action error: ', e)
  }
}
