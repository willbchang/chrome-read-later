export function renderListFrom(page) {
  return ` 
      <li id=${page.date} title="${page.title}\n${page.url}" tabindex="1">
        <img src="${page.favIconUrl}" alt="">
        <a href="${page.url}" ${getTitleColor()} tabindex="-1">${page.title}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleColor() {
    return page.url === page.title ? 'style="color: gray"' : ''
  }

  function getScrollPercent() {
    return page.scroll.top
      ? `<span class="position">${page.scroll.percent}</span>`
      : ''
  }
}
