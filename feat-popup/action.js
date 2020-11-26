import * as extension from '../modules-chrome/runtime.mjs'

export const reactive = (li, isKeyboard = true) => {
  // 1. Execute up action on first visible li,
  //  and down action on last visible li will get empty target li
  // 2. Update row number on delete last li
  if (li.html() === undefined) return updateRowNumber()
  $('.active').removeClass('active')
  li.addClass('active')
  // The reading list will be overflowed if it's longer than 17,
  //  assign active class will not make the overflowed view visible.
  //  scrollIntoView can solve this problem.
  if (isKeyboard) li[0].scrollIntoView({behavior: 'smooth'})
  updateRowNumber()
}

const move = li => {
  li.attr('id') < $('#reading-list li:visible:last').attr('id') ? up(li) : down(li)
}

const updateTotalCount = () => {
  const ul = $('#reading-list li:visible')
  $('#total').text(ul.length)
}

const updateRowNumber = () => {
  const rowNumber = $('#reading-list li:visible').index($('.active')) + 1
  $('#row').text(rowNumber)
}

export const open = ({currentTab = false, active = true}) => {
  const li = $('.active')
  const url = li.find('a').attr('href')
  li.fadeOut('normal', () => {
    updateTotalCount()
    move(li)
  })
  extension.sendMessage({url, currentTab, active})
  if (currentTab) window.close()
}

export const remove = () => {
  if (localStorage.getItem('isMoving') === 'true') return
  localStorage.setItem('isMoving', 'true')
  const li = $('.active')
  const url = li.find('a').attr('href')
  li.fadeOut('normal', () => {
    updateTotalCount()
    move(li)
    localStorage.setItem('isMoving', 'false')
  })
  localStorage.setArray('dependingUrls', url)
}

export const restore = () => {
  const url = localStorage.popArray('dependingUrls')
  const li = $(`a[href="${url}"]`).parent().fadeIn()
  reactive(li)
  updateTotalCount()
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

export const copy = async () => {
  const url = $('.active').find('a').attr('href')
  await navigator.clipboard.writeText(url)
}
