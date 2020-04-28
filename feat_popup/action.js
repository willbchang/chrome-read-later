import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as filter from './filter.js'

export const remove = target => {
  filter.remove(target)
  storage.remove(filter.url(target))
}

export const open = target => {
  extension.sendMessage({url: filter.url(target)})
}
