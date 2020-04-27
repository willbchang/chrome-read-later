import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'


const getUrlFrom = target => {
  return {
    A: () => target.href,
    LI: () => target.childNodes[3].href,
    SPAN: () => target.previousSibling.previousSibling.href,
    IMG: () => target.nextElementSibling.href,
  }[target.tagName]()
}


const remove = target => {
  return {
    LI: () => target.remove(),
    IMG: () => target.parentNode.remove(),
  }[target.tagName]()
}

export const click = event => {
  event.preventDefault()
  const url = getUrlFrom(event.target)

  if (event.target.tagName === 'IMG') {
    remove(event.target)
    return storage.remove(url)
  }

  extension.sendMessage({url})
}

export const keydown = ({target, key}) => {
  try {
    return {
      Enter: () => extension.sendMessage({url: getUrlFrom(target)}),
      Backspace: () => {
        remove(target)
        storage.remove(getUrlFrom[target])
      }
    }[key]()
  } catch (e) {
    console.log('Catch default keys action: ', key)
  }
}
