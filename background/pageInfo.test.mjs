import { beforeAll, describe, expect, test } from 'bun:test'

/* global globalThis */

let initPageInfo

beforeAll(async () => {
    globalThis.chrome = { runtime: { id: 'extension-id' } }
    const pageInfo = await import('./pageInfo.js')
    initPageInfo = pageInfo.initPageInfo
})

describe('page favicon URL', () => {
    test('uses the site favicon service for a visited tab', () => {
        const page = initPageInfo({
            tab: {
                url:   'https://example.com/visited/article',
                title: 'Visited article',
            },
            position:  {},
            selection: {},
        })

        const faviconUrl = new URL(page.favIconUrl)
        expect(faviconUrl.origin).toBe('https://t0.gstatic.com')
        expect(faviconUrl.searchParams.get('url'))
            .toBe('https://example.com')
    })

    test('uses the site favicon for an unvisited selected link', () => {
        const page = initPageInfo({
            tab: {
                url:   'https://source.example/article',
                title: 'Source article',
            },
            position:  {},
            selection: {
                linkUrl:       'https://target.example/unvisited/article',
                selectionText: 'Target article',
            },
        })

        const faviconUrl = new URL(page.favIconUrl)
        expect(faviconUrl.origin).toBe('https://t0.gstatic.com')
        expect(faviconUrl.searchParams.get('url'))
            .toBe('https://target.example')
    })
})
