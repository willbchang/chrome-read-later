import * as extension from '../modules_chrome/runtime.mjs'
import * as storage from '../modules_chrome/storage.mjs'
import * as dom from './dom.js'

export const remove = target => {
  const url = dom.url(target)
  dom.remove(target)
  storage.remove(url)
}

export const open = target => {
  const url = dom.url(target)
  extension.sendMessage({url})
}
