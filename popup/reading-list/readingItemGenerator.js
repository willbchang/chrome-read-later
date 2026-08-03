export function renderLiFrom (page, { isLocalOverflow = false } = {}) {
    return `
      <li id=${page.date}${isLocalOverflow ? ' class="local-overflow"' : ''}>
        <img src="${page.favIconUrl}" alt="">
        <a href="${page.url}" title="${getTitleAttribute()}" class="${getTextClass()}" tabindex="-1">${encodeInnerText()}</a>
        ${getVideoPercent() || getScrollPercent()}
      </li>
    `

    function getTitleAttribute () {
        return page.title === page.url
            ? page.url
            : `${encodeInnerText()}\n\n${page.url}`
    }

    function getTextClass () {
        return page.url === page.title ? 'url-only' : ''
    }

    function encodeInnerText () {
        try {
            // eslint-disable-next-line no-undef
            return he.encode(page.title)
        } catch (e) {
            console.log(e, page)
            return page.title
        }
    }

    function getVideoPercent () {
        return ['0%', '100%', undefined].includes(page.video?.percent)
            ? ''
            : `<span class="percent video">${page.video?.percent}</span>`
    }

    function getScrollPercent () {
        return page.scroll.top
            ? `<span class="percent scroll">${page.scroll.percent}</span>`
            : ''
    }
}
