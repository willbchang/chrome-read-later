import * as storage from './modules/storage.js'
import * as tabs from './modules/tabs.js'

appendReadingListToHtml()
$(() => {
  clickLinkToUpdateTabAndStorage()
  hoverMouseToChangeIcon()
  clickIconToDelete()
  clickButtonToReset()
})

function appendReadingListToHtml() {
  storage.get(pages => {
    Object.values(pages)
      .sort((a, b) => a.date - b.date)
      .map(page => append(page))
  })

  function append(page) {
    $('ul').append(`
      <li id=${page.date}>
        <img src="${page.favIconUrl}">
        <a href="${page.url}" target="_blank">${page.title}</a>
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

function clickLinkToUpdateTabAndStorage() {
  $('ul').on('click', 'a', e => {
    // disable default <a> tag action
    e.preventDefault()
    tabs.openInCurrentOrNewTab(e.target.href)
    storage.remove(e.target.href)
    window.close()
  })
}

function hoverMouseToChangeIcon() {
  let src = ''
  $(document).on(
    {
      mouseenter: e => {
        src = $(e.target).attr('src')
        $(e.target).attr('src', '../images/32x32delete.png')
      },
      mouseleave: e => {
        $(e.target).attr('src', src)
      },
    },
    'img'
  )
}

function clickIconToDelete() {
  $('img').on('click', e => {
    $(e.target.parentNode).remove()
    storage.remove(e.target.nextElementSibling.href)
  })
}

function clickButtonToReset() {
  $('button').on('click', () => {
    storage.clear()
    window.close()
  })
}
