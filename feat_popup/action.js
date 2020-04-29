import * as extension from '../modules_chrome/runtime.mjs'
import * as filter from './filter.js'

export const remove = target => {
  const li = filter.element(target)
  li.fadeOut()
  li.is(':last-child') ? up(target) : down(target)

  const dependingUrls = JSON.parse(localStorage.getItem('dependingUrls') || '[]')
  dependingUrls.push(filter.url(target))
  localStorage.setItem('dependingUrls', JSON.stringify(dependingUrls))
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


export const top = () => {
  $('li').first().focus()
}

export const bottom = () => {
  $('li').last().focus()
}
