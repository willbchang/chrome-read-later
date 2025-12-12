import * as storage from '../modules/chrome/storage.mjs'

$(async () => {
    const pages = await storage.sync.sortByLatest()

    // Simplify the data: timestamp (ISO format), title, URL, scroll, and video
    const simplifiedPages = pages.map(page => {
        const result = {
            timestamp: new Date(page.date).toISOString(),
            title: page.title,
            url: page.url
        }

        // Only include scroll if non-default
        const isDefaultScroll = page.scroll?.top === 0
            && page.scroll?.height === 0
            && page.scroll?.percent === '0%'
        if (!isDefaultScroll) {
            result.scroll = page.scroll
        }

        // Only include video if non-default
        const isDefaultVideo = page.video?.currentTime === 0
            && page.video?.playbackRate === 1
            && page.video?.percent === '0%'
        if (!isDefaultVideo) {
            result.video = page.video
        }

        return result
    })

    // Export as JSONL (JSON Lines) - one object per line
    const jsonl = simplifiedPages.map(page => JSON.stringify(page)).join('\n')
    $('#json-output').text(jsonl)

    // Copy to clipboard handler
    $('#copy').on('click', async () => {
        await navigator.clipboard.writeText(jsonl)
        const $btn = $('#copy')
        const originalText = $btn.text()
        $btn.text('Copied!')
        setTimeout(() => $btn.text(originalText), 2000)
    })

    // Download handler
    $('#download').on('click', () => {
        const blob = new Blob([jsonl], { type: 'application/x-ndjson' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `reading-list-${new Date().toISOString().split('T')[0]}.jsonl`
        a.click()
        URL.revokeObjectURL(url)
    })
})
