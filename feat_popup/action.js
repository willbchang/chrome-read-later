import * as extension from '../modules_chrome/runtime.mjs'
import * as filter from './filter.js'
import * as local from './localStorage.mjs'

function onChange(target) {
  filter.element(target)
    .fadeOut()
    .is(':last-child') ? up(target) : down(target)
}

export const remove = target => {
  onChange(target)
  local.setArray('dependingUrls', filter.url(target))
}

export const restore = () => {
  const url = local.popArray('dependingUrls')
  $(`a[href="${url}"]`).parent().fadeIn().focus()
}

export const open = ({target, currentTab = false, active = true}) => {
  extension.sendMessage({url: filter.url(target), currentTab, active})
  if (currentTab) window.close()
}

export const up = target => {
  $(target).prevAll(':visible:first').focus()
}

export const down = target => {
  $(target).nextAll(':visible:first').focus()
}

export const top = () => {
  $('li:visible').first().focus()
}

export const bottom = () => {
  $('li:visible').last().focus()
}
