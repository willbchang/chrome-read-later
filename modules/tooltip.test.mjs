import { describe, expect, test } from 'bun:test'
import { calculateTooltipPosition } from './tooltip.mjs'

const tooltip = { width: 120, height: 40 }
const viewport = { width: 400, height: 300 }

describe('tooltip positioning', () => {
    test('uses the top when it has room', () => {
        const position = calculateTooltipPosition(
            { top: 200, bottom: 220, left: 100, width: 40 },
            tooltip,
            viewport
        )

        expect(position).toEqual({ top: 152, left: 60, placement: 'top' })
    })

    test('uses the bottom when the top has no room', () => {
        const position = calculateTooltipPosition(
            { top: 10, bottom: 30, left: 100, width: 40 },
            tooltip,
            viewport
        )

        expect(position).toEqual({ top: 38, left: 60, placement: 'bottom' })
    })

    test('chooses more space and stays inside a short viewport', () => {
        const position = calculateTooltipPosition(
            { top: 20, bottom: 40, left: 100, width: 40 },
            { width: 120, height: 80 },
            { width: 400, height: 100 }
        )

        expect(position).toEqual({ top: 12, left: 60, placement: 'bottom' })
    })

    test('clamps against the right viewport edge', () => {
        const position = calculateTooltipPosition(
            { top: 200, bottom: 220, left: 380, width: 20 },
            tooltip,
            viewport
        )

        expect(position.left).toBe(272)
    })
})
