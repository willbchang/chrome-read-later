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
})
