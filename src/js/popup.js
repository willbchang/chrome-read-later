import * as storage from "./storage.js"
import * as tabs from "./tabs.js"

$(() => {
  setReadingList()
  $("ul").on("click", "a", (e) => {
    tabs.create(e.target.href)
    storage.remove(e.target.parentNode.id)
  })

  $("button").on("click", () => {
    storage.clear()
    window.close()
  })
})

function setReadingList() {
  storage.get(pages => {
    for (const time in pages) {
      append(time, pages[time])
    }
  })
}

function append(time, page) {
  $("ul").append(`
    <li id=${time}>
      <img src = ${page.favIconUrl}>
      <a href="${page.url}" target="_blank">${page.title}</a>
    </li>
  `)
}
