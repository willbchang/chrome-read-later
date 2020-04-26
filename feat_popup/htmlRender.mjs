export function renderListFrom(page) {
  return ` 
      <li id=${page.date} title="${encodeTitle()}\n${page.url}" tabindex="1">
        <img src="${page.favIconUrl}" alt="">
        <a href="${page.url}" ${getTitleColor()} tabindex="-1">${encodeTitle()}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleColor() {
    return page.url === page.title ? 'style="color: gray"' : ''
  }

  function encodeTitle() {
    return $('<div>').text(page.title).html()
  }

  function getScrollPercent() {
    return page.scroll.top
      ? `<span class="position">${page.scroll.percent}</span>`
      : ''
  }
}
