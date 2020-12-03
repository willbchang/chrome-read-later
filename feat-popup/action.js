import * as extension from '../modules-chrome/runtime.mjs'

const activeLi = () => $('.active')
const visibleLis = () => $('#reading-list li:visible')

export const reactive = li => {
  // 1. Execute up() on first visible li, and down() on last visible li
  //     will get empty target li.
  // 2. Update row number on deleting last li, row number will be 0
  if (li.html()) {
    activeLi().removeClass('active')
    li.addClass('active')
  }
}

const scrollTo = li => {
  // Don't make scroll on empty li, which is deleting the last li.
  if (li.html() === undefined) return
  // The reading list will be overflowed if it's longer than 17,
  //  assign active class will not make the overflowed view visible.
  //  $.animate() can solve this problem.
  const isFirstLi = visibleLis().index(li) === 0
  $('html, body')
    .stop(true, true) // Stop jQuery animation delay on continuous movement.
    .animate({scrollTop: isFirstLi ? 0 : li.offset().top}, 'fast')
}

const moveToPreviousOrNext = li => {
  li.attr('id') < visibleLis().last().attr('id') ? moveTo('previous') : moveTo('next')
}

const updateTotalCount = () => {
  const ul = visibleLis()
  $('#total').text(ul.length)
}

export const updateRowNumber = () => {
  const rowNumber = visibleLis().index(activeLi()) + 1
  $('#row').text(rowNumber)
}

export const open = ({currentTab = false, active = true}) => {
  const li = activeLi()
  const url = li.find('a').attr('href')
  li.fadeOut('normal', () => {
    updateTotalCount()
    moveToPreviousOrNext(li)
  })
  localStorage.setArray('dependingUrls', url)
  extension.sendMessage({url, currentTab, active})
  if (currentTab) window.close()
}

// dele is synonym of delete, delete is a keyword in JavasScript
export const dele = () => {
  if (localStorage.getItem('isMoving') === 'true') return
  localStorage.setItem('isMoving', 'true')
  const li = activeLi()
  const url = li.find('a').attr('href')
  li.fadeOut('normal', () => {
    updateTotalCount()
    moveToPreviousOrNext(li)
    localStorage.setItem('isMoving', 'false')
  })
  localStorage.setArray('dependingUrls', url)
}

export const undo = () => {
  const url = localStorage.popArray('dependingUrls')
  const li = $(`a[href="${url}"]`).parent().fadeIn()
  reactive(li)
  scrollTo(li)
  updateRowNumber()
  updateTotalCount()
}

export const moveTo = direction => {
  const li = {
    previous: () => activeLi().prevAll(':visible').first(),
    next:     () => activeLi().nextAll(':visible').first(),
    top:      () => visibleLis().first(),
    bottom:   () => visibleLis().last(),
  }[direction]()

  reactive(li)
  scrollTo(li)
  updateRowNumber()
}

export const copyUrl = async () => {
  const url = activeLi().find('a').attr('href')
  await navigator.clipboard.writeText(url)
}
