import * as extension from '../../modules/chrome/runtime.mjs'

const activeLi = () => $('.active')
const activeUrl = () => activeLi().find('a').attr('href')
const visibleLis = () => $('#reading-list li:visible')
const getLocalStorageKey = () => window.isHistoryPage ? 'deletedLocalUrls' : 'deletedSyncUrls'

export const open = ({currentTab = false, active = true}) => {
  if (!window.isHistoryPage) dele()
  extension.sendMessage({url: activeUrl(), currentTab, active, isHistory: window.isHistoryPage})
  if (currentTab) window.close()
}

// dele is synonym of delete, delete is a keyword in JavasScript
export const dele = () => {
  if (window.isHidingLi) return
  window.isHidingLi = true
  const li = activeLi()
  li.fadeOut('normal', () => {
    updateTotalNumber()
    moveToPreviousOrNext(li)
    window.isHidingLi = false
  })
  localStorage.setArray(getLocalStorageKey(), activeUrl())
}

export const undo = () => {
  const url = localStorage.popArray(getLocalStorageKey())
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
  activeLi().fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
  await navigator.clipboard.writeText(activeUrl())
}

export const reactive = li => {
  activeLi().removeClass('active')
  li.addClass('active')
}

export const scrollTo = (li) => {
  li[0].scrollIntoView({block: 'nearest'})
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

