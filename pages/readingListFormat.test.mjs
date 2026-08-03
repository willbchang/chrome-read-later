import { describe, expect, test } from 'bun:test'
import {
    parseReadingList,
    serializeReadingList,
} from './readingListFormat.mjs'

const first = { title: 'First', url: 'https://first.example' }
const second = { title: 'Second', url: 'https://second.example' }

describe('reading list formats', () => {
    test('parses a JSON array', () => {
        const entries = parseReadingList(JSON.stringify([first, second]))

        expect(entries.map(entry => entry.item)).toEqual([first, second])
    })

    test('parses a single JSON object', () => {
        const entries = parseReadingList(JSON.stringify(first))

        expect(entries.map(entry => entry.item)).toEqual([first])
    })

    test('keeps JSONL imports compatible', () => {
        const entries = parseReadingList(
            `${JSON.stringify(first)}\n${JSON.stringify(second)}`
        )

        expect(entries.map(entry => entry.item)).toEqual([first, second])
    })

    test('reports malformed JSONL lines without dropping valid lines', () => {
        const entries = parseReadingList(`${JSON.stringify(first)}\ninvalid`)

        expect(entries[0].item).toEqual(first)
        expect(entries[1].error).toBeInstanceOf(Error)
    })

    test('serializes a formatted JSON array', () => {
        const json = serializeReadingList([first, second])

        expect(JSON.parse(json)).toEqual([first, second])
        expect(json).toContain('\n  {')
    })

    test('serializes JSONL when selected', () => {
        const jsonl = serializeReadingList([first, second], 'jsonl')

        expect(jsonl).toBe(
            `${JSON.stringify(first)}\n${JSON.stringify(second)}`
        )
    })
})
