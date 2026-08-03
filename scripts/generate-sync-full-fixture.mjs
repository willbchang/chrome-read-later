import { mkdir } from 'node:fs/promises'

const itemCount = 180
const testDataDirectory = new URL('../test-data/', import.meta.url)
const outputFile = new URL('read-later-sync-full.jsonl', testDataDirectory)
const filler = 'This is identifiable fake content for testing Chrome sync storage quota behavior. '.repeat(9)

const records = Array.from({ length: itemCount }, (_, index) => {
    const number = String(index + 1).padStart(3, '0')
    return {
        timestamp: new Date(Date.UTC(2026, 0, 1, 0, index)).toISOString(),
        title:     `[SYNC QUOTA TEST ${number}] ${filler}`,
        url:       `https://read-later-test.invalid/article-${number}`,
    }
})

await mkdir(testDataDirectory, { recursive: true })
await Bun.write(
    outputFile,
    records.map(record => JSON.stringify(record)).join('\n') + '\n'
)

console.log(`Generated ${itemCount} fake links at ${outputFile.pathname}`)
