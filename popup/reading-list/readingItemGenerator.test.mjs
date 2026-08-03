import { beforeAll, describe, expect, test } from 'bun:test'

/* global globalThis */

globalThis.he = { encode: value => value }

let renderLiFrom

beforeAll(async () => {
    ({ renderLiFrom } = await import('./readingItemGenerator.js'))
})

const page = {
    url:        'https://local.example',
    title:      'Local overflow item',
    date:       1,
    favIconUrl: '',
    scroll:     { top: 0 },
    video:      {},
}

describe('reading item storage styling', () => {
    test('marks local overflow rows', () => {
        expect(renderLiFrom(page, { isLocalOverflow: true }))
            .toContain('class="local-overflow"')
    })

    test('does not mark synced rows', () => {
        expect(renderLiFrom(page))
            .not.toContain('local-overflow')
    })

    test('uses the shared tooltip instead of a native title', () => {
        const html = renderLiFrom(page)

        expect(html).toContain('data-tooltip=')
        expect(html).not.toContain(' title=')
    })

    test('can disable item popovers', () => {
        const html = renderLiFrom(page, { showPopover: false })

        expect(html).not.toContain('data-tooltip=')
    })

    test('uses the site favicon service for existing saved items', () => {
        const html = renderLiFrom({
            ...page,
            favIconUrl: 'chrome-extension://extension-id/_favicon/',
        })

        expect(html).toContain('https://t0.gstatic.com/faviconV2?')
        expect(html).toContain('url=https%3A%2F%2Flocal.example')
        expect(html).not.toContain('chrome-extension://extension-id')
    })
})
