import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as filter from './filter.js'

export const remove = target => {
  down(target)
  filter.element(target).remove()
  storage.remove(filter.url(target))
}

export const open = target => {
  extension.sendMessage({url: filter.url(target)})
}


export const up = target => {
  $(target).closest('li').prev('li').focus()
}

export const down = target => {
  $(target).closest('li').next('li').focus()
}


export const top = () => scroll(0, 0)

export const bottom = () => scroll(0, document.body.scrollHeight)
