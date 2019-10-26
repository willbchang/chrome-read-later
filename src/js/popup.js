import * as storage from "./storage.js"
import * as tabs from "./tabs.js"

const get = function getChromeStorage(set) {
  storage.get(data => {
    for (const time in data) {
      set(data[time].url, data[time].title, data[time].favIconUrl, time)
    }
  })
}

const set = function setReadingList(url, title, favIconUrl, time) {
  $("ul").append(`
    <li>
      <img src = ${favIconUrl}>
      <a href="${url}" target="_blank">${title}</a>
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

document.addEventListener('DOMContentLoaded', () => {
  get(set)
  document.onclick = click
})
