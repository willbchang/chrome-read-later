import * as action from './action.js'

export const keydown = ({target, key}) => {
  try {
    return {
      Enter: () => action.open(target),
      Backspace: () => action.remove(target),
    }[key]()
  } catch (e) {
    console.log('Catch default keys action: ', key)
  }
}


export const click = event => {
  event.preventDefault()

  event.target.tagName === 'IMG'
    ? action.remove(event.target)
    : action.open(event.target)
}
