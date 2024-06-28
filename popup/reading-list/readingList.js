import * as storage from '../../modules/chrome/storage.mjs'
import * as generator from './readingItemGenerator.js'
import * as action from '../action.js'
import * as filter from '../filter.js'

const readingList = $('#reading-list')

export async function setup () {
    resetEventListeners()
    await initDomFromStorage()
    activeFirstLi()
    changeIconOnMouseEnterLeave()
    updateStateOnMouseMove()
    doActionOnMouseClick()
    doActionOnBodyKeyDown()
}

function resetEventListeners () {
    // Remove all events listeners
    readingList.off()
    $('body').off()
}

async function initDomFromStorage () {
    const pages = window.isHistory
        ? await storage.local.sortByLatest()
        : await storage.sync.sortByLatest()
    const oldReadingItemsLength = readingList.children().length

    pages.filter(page => page.url)
        .map(page => readingList.append(generator.renderLiFrom(page)))

    // This way improve the UX, readingList.empty() will flash the screen.
    readingList.children().slice(0, oldReadingItemsLength).remove()
}

function activeFirstLi () {
    const li = $('#reading-list li').first()
    const hasReadingItem = li.length !== 0

    if (hasReadingItem) {
        action.reactive(li)
        action.scrollTo(li)
    }
}

function changeIconOnMouseEnterLeave () {
    readingList.on({
        mouseenter: showDeleteIcon,
        mouseleave: showFavIcon,
    }, 'img')
}

function updateStateOnMouseMove () {
    readingList.on('mousemove', 'li', ({ target }) => {
        const li = target.tagName === 'LI' ? $(target) : $(target.parentNode)
        action.reactive(li)
        action.updateRowNumber()
    })
}

function doActionOnMouseClick () {
    readingList.on('click', event => {
        event.preventDefault()

        try {
            const clickType = filter.getClickType(event, 'readingList')
            const clickAction = filter.getClickAction(clickType)
            clickAction()
        } catch (e) {
            console.log('Catch click action error: ', e, event.target.tagName)
        }
    })
}

function doActionOnBodyKeyDown () {
    $('body').on('keydown', event => {
        if (event.key.includes('Arrow')) event.preventDefault()
        const keyBinding = filter.getKeyBinding(event)
        const keyAction = filter.getKeyAction(keyBinding)
        keyAction && keyAction()
    })
}

function showDeleteIcon (event) {
    localStorage.setItem('src', event.target.src)
    event.target.src = isDarkMode()
        ? '../../icons/delete-white32x32.png'
        : '../../icons/delete-black32x32.png'
}

function isDarkMode () {
    return window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon (event) {
    event.target.src = localStorage.getItem('src')
}
