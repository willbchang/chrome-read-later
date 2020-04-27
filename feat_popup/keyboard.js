import * as action from './action.js'

const dispatchKeydown = ({target, key}) => {
  try {
    return {
      Enter: () => action.open(target),
      Backspace: () => action.remove(target),
    }[key]()
  } catch (e) {
    console.log('Catch default keys action: ', key)
  }
}

export default dispatchKeydown
