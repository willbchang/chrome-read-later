import * as extension from '../modules_chrome/runtime.mjs'
import * as filter from './filter.js'

function onHide(target) {
  const li = filter.element(target)
  li.fadeOut('normal', () => {
    const isLastLi = li.prevAll(':visible:first').attr('id') === $('li:visible').last().attr('id')
    isLastLi ? up(target) : down(target)
  })
}

export const remove = target => {
  onHide(target)
  localStorage.setArray('dependingUrls', filter.url(target))
}

export const restore = () => {
  const url = localStorage.popArray('dependingUrls')
  $(`a[href="${url}"]`).parent().fadeIn().focus()
}

export const open = ({target, currentTab = false, active = true}) => {
  onHide(target)
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
