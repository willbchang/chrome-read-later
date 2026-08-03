import { getSiteFaviconUrl } from '../../modules/favicon.mjs'

export function renderLiFrom (page, {
    isLocalOverflow = false,
    showPopover = true,
} = {}) {
    return `
      <li id=${page.date}${isLocalOverflow ? ' class="local-overflow"' : ''}>
        <img src="${getSiteFaviconUrl(page.url) || page.favIconUrl}" alt="">
        <a href="${page.url}"${getTooltipAttribute()} class="${getTextClass()}" tabindex="-1">${encodeInnerText()}</a>
        ${getVideoPercent() || getScrollPercent()}
      </li>
    `

    function getTooltipAttribute () {
        if (!showPopover) return ''
        const text = page.title === page.url
            ? page.url
            : `${page.title}\n\n${page.url}`
        // eslint-disable-next-line no-undef
        return ` data-tooltip="${he.encode(text)}"`
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
