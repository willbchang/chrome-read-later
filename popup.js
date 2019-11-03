import "./modules/tab.prototype.js"
import * as storage from "./modules/storage.js"
import * as tabs from "./modules/tabs.js"

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
    $("ul").append(`
      <li id=${page.date}>
        <img src="${page.favIconUrl}">
        <a href="${page.url}" target="_blank">${page.title}</a>
        <sub>${page.position}</sub>
      </li>
    `)
  }
}

function clickLinkToUpdateTabAndStorage() {
  $("ul").on("click", "a", (e) => {
    // disable default <a> tag action
    e.preventDefault()
    openReadingList(e)
    storage.remove(e.target.href)
    window.close()
  })

  function openReadingList(e) {
    // open in current empty tab or create a new tab
    tabs.current(tab => {
      tab.isEmpty() ? tabs.update(tab, e.target.href) : tabs.create(e.target.href)
    })
  }
}

function hoverMouseToChangeIcon() {
  let src = ""
  $(document).on({
    mouseenter: (e) => {
      src = $(e.target).attr("src")
      $(e.target).attr("src", "../images/32x32delete.png")
    },
    mouseleave: (e) => {
      $(e.target).attr("src", src)
    }
  }, "img")
}

function clickIconToDelete() {
  $("img").on("click", (e) => {
    $(e.target.parentNode).remove()
    storage.remove(e.target.nextElementSibling.href)
  })
}

function clickButtonToReset() {
  $("button").on("click", () => {
    storage.clear()
    window.close()
  })
}
