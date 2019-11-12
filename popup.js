import * as event from './modules/event.js'
import * as extension from './modules/extension.js'
import * as storage from './modules/storage.js'

initReadingList()
$(() => {
  event.onClick('a', sendUrlToBackground)
  event.onHover('img', showDeleteIconOnEnter, showFavIconOnLeave)
  event.onClick('img', removeItem)
  clickButtonToReset()
})

function initReadingList() {
  storage.getSorted(pages => pages.map(page => append(page)))

  function append(page) {
    $('ul').append(`
      <li id=${page.date}>
        <img src="${page.favIconUrl}">
        <a href="${page.url}">${page.title}</a>
      </li>
    `)

    if (!page.scrollTop) return
    $(`#${page.date}`).append(`
      <span class="position">
        ${page.scrollPercent}
      </span>
    `)
  }
}

function sendUrlToBackground(e) {
  // disable default <a> tag action
  e.preventDefault()
  extension.sendMessage({ url: e.target.href })
  window.close()
}

function showDeleteIconOnEnter(e) {
  localStorage.setItem('src', $(e.target).attr('src'))
  $(e.target).attr('src', '../images/32x32delete.png')
}

function showFavIconOnLeave(e) {
  $(e.target).attr('src', localStorage.getItem('src'))
}

function removeItem(e) {
  $(e.target.parentNode).remove()
  storage.remove(e.target.nextElementSibling.href)
}

function clickButtonToReset() {
  $('button').on('click', () => {
    storage.clear()
    window.close()
  })
}
