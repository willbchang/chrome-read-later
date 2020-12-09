import * as extension from './chrome/runtime.mjs'

const activeLi = () => $('.active')
const activeUrl = () => activeLi().find('a').attr('href')
const visibleLis = () => $('#reading-list li:visible')

export const open = ({currentTab = false, active = true}) => {
  if (!window.isLocal) dele()
  extension.sendMessage({url: activeUrl(), currentTab, active})
  if (currentTab) window.close()
}

// dele is synonym of delete, delete is a keyword in JavasScript
export const dele = () => {
  if (window.isMoving) return
  window.isMoving = true
  const li = activeLi()
  li.fadeOut('normal', () => {
    updateTotalNumber()
    moveToPreviousOrNext(li)
    window.isMoving = false
  })
  localStorage.setArray('dependingUrls', activeUrl())
}

export const undo = () => {
  const url = localStorage.popArray('dependingUrls')
  const li = $(`a[href="${url}"]`).parent().fadeIn()

  if (li.html()) {
    reactive(li)
    scrollTo(li)
  }

  updateRowNumber()
  updateTotalNumber()
}

export const moveTo = direction => {
  const li = {
    previous: () => activeLi().prevAll(':visible').first(),
    next:     () => activeLi().nextAll(':visible').first(),
    top:      () => visibleLis().first(),
    bottom:   () => visibleLis().last(),
  }[direction]()

  if (li.html()) {
    reactive(li)
    scrollTo(li)
  }

  updateRowNumber()
}

export const copyUrl = async () => {
  await navigator.clipboard.writeText(activeUrl())
}

export const reactive = li => {
  activeLi().removeClass('active')
  li.addClass('active')
}

const scrollTo = li => {
  // The reading list will be overflowed if it's longer than 17,
  //  assign active class will not make the overflowed view visible.
  //  $.animate() can solve this problem.
  const isFirstLi = visibleLis().index(li) === 0
  $('html, body')
    .stop(true, true) // Stop jQuery animation delay on continuous movement.
    .animate({scrollTop: isFirstLi ? 0 : li.offset().top}, 'fast')
}

export const updateTotalNumber = () => {
  const ul = visibleLis()
  $('#total').text(ul.length)
}

export const updateRowNumber = () => {
  const rowNumber = visibleLis().index(activeLi()) + 1
  $('#row').text(rowNumber)
}

const moveToPreviousOrNext = li => {
  // The reading list is sort by the latest, the id is the timestamp,
  //  so the current id should be larger than last li, otherwise itself
  //  is the last li.
  const isLastLi = li.attr('id') < visibleLis().last().attr('id')
  isLastLi ? moveTo('previous') : moveTo('next')
}

