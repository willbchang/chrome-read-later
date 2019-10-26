import * as storage from "./storage.js"
import * as tabs from "./tabs.js"

$(() => {
  setReadingList()
  document.onclick = click
})

function setReadingList() {
  storage.get(pages => {
    for (const time in pages) {
      append(pages[time])
    }
  })
}

function append(page) {
  $("ul").append(`
    <li>
      <img src = ${page.favIconUrl}>
      <a href="${page.url}" target="_blank">${page.title}</a>
    </li>
  `)
}

const click = function clickEvents(e) {
  const tag = e.target.tagName

  if (tag === 'A') {
    tabs.create(e.target.href)
    storage.remove(e.target.parentNode.id)
  }

  if (tag === 'BUTTON') {
    storage.clear()
    window.close()
  }
}
