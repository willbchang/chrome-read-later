import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as filter from './filter.js'

export const remove = target => {
  const url = filter.url(target)
  filter.remove(target)
  storage.remove(url)
}

export const open = target => {
  const url = filter.url(target)
  extension.sendMessage({url})
}
