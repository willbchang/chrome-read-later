import "../modules/tab.prototype.js";
import * as storage from "../modules/storage.js"
import * as tabs from "../modules/tabs.js"

setReadingList()
$(() => {
  $("ul").on("click", "a", (e) => {
    openReadingList(e)
    storage.remove(e.target.parentNode.id)
    window.close();
  })

  setIconOnMouseChanged();

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
      <img src="${page.favIconUrl}">
      <a href="${page.url}" target="_blank">${page.title}</a>
    </li>
  `)
}

function openReadingList(e) {
  // disable default <a> tag action
  e.preventDefault()
  // open in current empty tab or create a new tab
  tabs.current(tab => {
    tab.isEmpty() ? tabs.update(tab, e.target.href) : tabs.create(e.target.href)
  })
}

function setIconOnMouseChanged() {
  let src;
  $(document).on({
    mouseenter: (e) => {
      src = $(e.target).attr('src');
      $(e.target).attr('src', "../images/32x32delete.png");
    },
    mouseleave: (e) => {
      $(e.target).attr("src", src);
    }
  }, "img");
}
