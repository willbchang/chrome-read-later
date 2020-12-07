import * as storage from '../modules-chrome/storage.mjs'
import * as generator from './readingItemGenerator.mjs'

const readingList = $('#reading-list')

export async function init() {
  const pages = await storage.sync.sortByLatest()
  const favIcons = await storage.local.get()
  pages.map(page => readingList.append(
    generator.renderLiFrom(page, favIcons[page.favIconUrl])
  ))
}


export function changeIconOnMouseEnterLeave() {
  readingList.on({
    mouseenter: showDeleteIcon,
    mouseleave: showFavIcon
  }, 'img')
}

function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../assets/icons/delete-white32x32.png' : '../assets/icons/delete-black32x32.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
}