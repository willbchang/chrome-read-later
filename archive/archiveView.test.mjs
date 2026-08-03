import { describe, expect, test } from 'bun:test'
import {
    filterArchivePages,
    getArchiveProgress,
    getDisplayUrl,
} from './archiveView.mjs'

const pages = [
    { title: 'A useful article', url: 'https://example.com/article' },
    { title: 'Release notes', url: 'https://github.com/example/release' },
]

describe('archive view', () => {
    test('filters by title or URL without changing the source list', () => {
        expect(filterArchivePages(pages, 'USEFUL')).toEqual([pages[0]])
        expect(filterArchivePages(pages, 'github.com')).toEqual([pages[1]])
        expect(filterArchivePages(pages, '')).toEqual(pages)
        expect(filterArchivePages(pages, '')).not.toBe(pages)
    })

    test('formats a compact display URL', () => {
        expect(getDisplayUrl('https://example.com/article')).toBe(
            'example.com/article'
        )
        expect(getDisplayUrl('not a URL')).toBe('not a URL')
    })

    test('prefers in-progress video progress over reading progress', () => {
        expect(getArchiveProgress({
            video:  { percent: '42%' },
            scroll: { top: 120, percent: '60%' },
        })).toEqual({ label: 'Video 42%', type: 'video' })
    })

    test('shows reading progress when there is no active video', () => {
        expect(getArchiveProgress({
            video:  { percent: '100%' },
            scroll: { top: 120, percent: '60%' },
        })).toEqual({ label: 'Read 60%', type: 'reading' })
        expect(getArchiveProgress({ scroll: { top: 0, percent: '0%' } }))
            .toBeUndefined()
    })
})
