import { describe, expect, test } from 'bun:test'
import { getSiteFaviconUrl } from './favicon.mjs'

describe('site favicon URL', () => {
    test('requests the site origin instead of the exact page URL', () => {
        const faviconUrl = new URL(getSiteFaviconUrl(
            'https://example.com/articles/read-later?source=feed#comments'
        ))

        expect(faviconUrl.origin).toBe('https://t0.gstatic.com')
        expect(faviconUrl.pathname).toBe('/faviconV2')
        expect(faviconUrl.searchParams.get('url'))
            .toBe('https://example.com')
        expect(faviconUrl.searchParams.get('size')).toBe('32')
    })

    test('preserves the subdomain and port', () => {
        const faviconUrl = new URL(getSiteFaviconUrl(
            'http://docs.example.com:8080/guide'
        ))

        expect(faviconUrl.searchParams.get('url'))
            .toBe('http://docs.example.com:8080')
    })

    test('rejects malformed and non-website URLs', () => {
        expect(getSiteFaviconUrl('not a url')).toBe('')
        expect(getSiteFaviconUrl('chrome://settings')).toBe('')
    })
})
