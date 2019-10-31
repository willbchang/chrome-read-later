import "./modules/tab.prototype.mjs"
import * as storage from "./modules/storage.mjs"
import * as tabs from "./modules/tabs.mjs"

appendReadingListToHtml()
$(() => {
  clickLinkToUpdateTabAndStorage()
  hoverMouseToChangeIcon()
  clickIconToDelete()
  clickButtonToReset()
})

function appendReadingListToHtml() {
  storage.get(pages => {
    for (const url in pages) {
      setReadigList(url, pages[url])
    }
  })

  function setReadigList(url, page) {
    $("ul").append(`
      <li id=${page.date}>
        <img src="${page.favIconUrl}">
        <a href="${url}" target="_blank">${page.title}</a>
      </li>
    `)
  }
}

function clickLinkToUpdateTabAndStorage() {
  $("ul").on("click", "a", (e) => {
    openReadingList(e)
    storage.remove(e.target.parentNode.id)
    window.close()
  })

  function openReadingList(e) {
    // disable default <a> tag action
    e.preventDefault()
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
    storage.remove(e.target.parentNode.id)
  })
}

function clickButtonToReset() {
  $("button").on("click", () => {
    storage.clear()
    window.close()
  })
}
