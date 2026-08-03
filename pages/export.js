import * as storage from '../modules/chrome/storage.mjs'
import { setupTooltips } from '../modules/tooltip.mjs'
import { serializeReadingList } from './readingListFormat.mjs'

setupTooltips()

$(async () => {
    const pages = await storage.sortSavedByLatest()

    // Simplify the data: timestamp (ISO format), title, URL, scroll, and video
    const simplifiedPages = pages.map(page => {
        const result = {
            timestamp: new Date(page.date).toISOString(),
            title:     page.title,
            url:       page.url
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

    const $format = $('#exportFormat')
    const $download = $('#download')
    const getFormat = () => $format.val()
    const getOutput = () => serializeReadingList(
        simplifiedPages,
        getFormat()
    )
    const renderOutput = () => {
        const format = getFormat()
        $('#json-output').text(getOutput())
        $download.text(`Download ${format.toUpperCase()}`)
    }

    renderOutput()
    $format.on('change', renderOutput)

    // Copy to clipboard handler
    $('#copy').on('click', async () => {
        await navigator.clipboard.writeText(getOutput())
        const $btn = $('#copy')
        const originalText = $btn.text()
        $btn.text('Copied!')
        setTimeout(() => $btn.text(originalText), 2000)
    })

    // Download handler
    $('#download').on('click', () => {
        const format = getFormat()
        const mimeType = format === 'json'
            ? 'application/json'
            : 'application/x-ndjson'
        const blob = new Blob([getOutput()], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `reading-list-${new Date().toISOString().split('T')[0]}.${format}`
        a.click()
        URL.revokeObjectURL(url)
    })
})
