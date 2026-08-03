import { describe, expect, test } from 'bun:test'
import { shouldShowDeleteIcon } from './selectionIcon.mjs'

describe('selected item delete icon', () => {
    test('always shows for enabled mode', () => {
        expect(shouldShowDeleteIcon('always', 'initial')).toBe(true)
        expect(shouldShowDeleteIcon('always', 'keyboard')).toBe(true)
        expect(shouldShowDeleteIcon('always', 'mouse')).toBe(true)
    })

    test('never shows for disabled mode', () => {
        expect(shouldShowDeleteIcon('never', 'keyboard')).toBe(false)
        expect(shouldShowDeleteIcon('never', 'mouse')).toBe(false)
    })

    test('shows only for mouse selection in mixed mode', () => {
        expect(shouldShowDeleteIcon('mixed', 'initial')).toBe(false)
        expect(shouldShowDeleteIcon('mixed', 'keyboard')).toBe(false)
        expect(shouldShowDeleteIcon('mixed', 'mouse')).toBe(true)
    })
})
