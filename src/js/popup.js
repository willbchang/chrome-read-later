import * as storage from "./storage.js"
import * as tabs from "./tabs.js"

$(() => {
  setReadingList()
  document.onclick = click
})

function setReadingList() {
  storage.get(data => {
    for (const time in data) {
      append(data[time])
    }
  })
}

function append(data) {
  $("ul").append(`
    <li>
      <img src = ${data.favIconUrl}>
      <a href="${data.url}" target="_blank">${data.title}</a>
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
