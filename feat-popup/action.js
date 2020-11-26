import * as extension from '../modules-chrome/runtime.mjs'
import * as filter from './filter.js'

export const reactive = (li, isKeyboard = true) => {
  // Execute up action on first visible li, and down action on last visible li will get empty target li
  if (li.html() === undefined) return
  $('.active').removeClass('active')
  li.addClass('active')
  // The reading list will be overflowed if it's longer than 17,
  //   assign active class will not make the overflowed view visible.
  //   scrollIntoView can solve this problem.
  if (isKeyboard) li[0].scrollIntoView({behavior: 'smooth'})
}

export const open = ({target, currentTab = false, active = true}) => {
  hide(target, move)
  extension.sendMessage({url: filter.url(target), currentTab, active})
  if (currentTab) window.close()
}

export const remove = () => {
  const li = $('.active')
  const url = li.find('a').attr('href')
  li.fadeOut('normal')
  move(li)
  localStorage.setArray('dependingUrls', url)
}

export const restore = () => {
  const url = localStorage.popArray('dependingUrls')
  $(`a[href="${url}"]`).parent().fadeIn().trigger('focus')
}

const hide = (li, move) => {
  li.fadeOut('normal', () => move(li))
}

const move = li => {
  li.attr('id') < $('#reading-list li:visible:last').attr('id') ? up(li) : down(li)
}

export const up = () => {
  const li = $('.active').prevAll(':visible:first')
  reactive(li)
}

export const down = () => {
  const li = $('.active').nextAll(':visible:first')
  reactive(li)
}

export const top = () => {
  const li = $('#reading-list li:visible:first')
  reactive(li)
}

export const bottom = () => {
  const li = $('#reading-list li:visible:last')
  reactive(li)
}

export const copy = async target => {
  await navigator.clipboard.writeText(filter.url(target))
}
