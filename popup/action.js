import * as runtime from '../modules/chrome/runtime.mjs'
import * as localStore from '../modules/localStore/localStore.mjs'
import * as readingList from './reading-list/readingList.js'

const activeLi = () => $('.active')
const activeUrl = () => activeLi().find('a').attr('href')
const visibleLis = () => $('#reading-list li:visible')
const getSessionKey = () => window.isHistory
    ? 'deletedLocalUrls'
    : 'deletedSyncUrls'

export const open = ({ currentTab = false, active = true }) => {
    if (window.isHidingLi) return // prevents open same instance multiple times
    if (!window.isHistory) dele()
    runtime.sendMessage({
        message: 'open',
        data:    {
            url:       activeUrl(),
            currentTab,
            active,
            isHistory: window.isHistory
        }
    })
    if (currentTab) window.close()
}

// dele is synonym of delete, delete is a keyword in JavasScript
export const dele = () => {
    if (window.isHidingLi) return // prevents hold d key and the deletion will jump around.
    window.isHidingLi = true
    const li = activeLi()
    li.fadeOut('normal', () => {
        updateTotalNumber()
        moveToPreviousOrNext(li)
        window.isHidingLi = false
    })

    runtime.sendMessage({
        message: 'dele',
        data:    {
            key: getSessionKey(),
            url: activeUrl(),
        }
    })
}

export const undo = () => {
    localStore.popArray(getSessionKey()).then(url => {
        const li = $(`a[href="${url}"]`).parent().fadeIn()

        if (li.html()) {
            reactive(li)
            scrollTo(li)
        }

        updateRowNumber()
        updateTotalNumber()
    })
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

export const question = () => window.open(
    'https://github.com/willbchang/chrome-read-later#readme')

export const reactive = li => {
    activeLi().removeClass('active')
    li.addClass('active')
}

export const scrollTo = (li) => {
    li[0].scrollIntoView({ block: 'nearest' })
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

export async function history () {
    const history = $('#history')
    window.isHistory = !window.isHistory
    window.lastKey = ''
    window.port.disconnect()
    window.port = runtime.connect()
    await readingList.setup()
    updateRowNumber()
    updateTotalNumber()
    window.isHistory
        ? history.addClass('highlight')
        : history.removeClass('highlight')
}

export function options () {
    chrome.runtime.openOptionsPage()
}

export function exportList () {
    const exportUrl = chrome.runtime.getURL('pages/export.html')
    window.open(exportUrl)
}

export function importList () {
    const importUrl = chrome.runtime.getURL('pages/import.html')
    window.open(importUrl)
}
