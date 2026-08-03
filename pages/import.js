import * as storage from '../modules/chrome/storage.mjs'
import { getSiteFaviconUrl } from '../modules/favicon.mjs'
import { setupTooltips } from '../modules/tooltip.mjs'
import { parseReadingList } from './readingListFormat.mjs'

setupTooltips()

$(async () => {
    const $textarea = $('#jsonInput')
    const $importButton = $('#importButton')

    // Enable/disable import button based on textarea content
    const updateButtonState = () => {
        $importButton.prop('disabled', !$textarea.val().trim())
    }

    $textarea.on('input', () => {
        updateButtonState()
        $('#importStatus').empty()
    })

    // File input handler - load file content into textarea
    $('#fileInput').on('change', async (event) => {
        const file = event.target.files[0]
        if (file) {
            $('#fileName').text(file.name)
            const content = await file.text()
            $textarea.val(content)
            updateButtonState()
        }
    })

    // Import button handler
    $importButton.on('click', async () => {
        const content = $textarea.val().trim()
        if (!content) return

        $importButton.prop('disabled', true)
        $('#importStatus').text('Importing...')

        try {
            const results = await importItems(content)
            if (results.failed === 0 && !results.usedLocalFallback) {
                $('#importStatus').html(`<span class="status-success">\u2713 Imported ${results.success} items</span>`)
            } else {
                const syncWarning = results.usedLocalFallback
                    ? ' Chrome Sync filled up, so overflow items were stored locally on this computer.'
                    : ''
                $('#importStatus').html(
                    `<span class="status-warning">Imported ${results.success} items. ` +
                    `${results.failed} failed.${syncWarning} Check browser console for details.</span>`
                )
            }
        } catch (error) {
            console.error('Import error:', error.message)
            $('#importStatus').html('<span class="status-error">Import failed - check browser console for details.</span>')
        } finally {
            updateButtonState()
        }
    })
})

async function importItems(content) {
    const entries = parseReadingList(content)
    const results = {
        success:           0,
        failed:            0,
        usedLocalFallback: false
    }

    for (const entry of entries) {
        try {
            if (entry.error) throw entry.error
            const imported = entry.item

            if (!imported?.url || !imported?.title) {
                throw new Error('Missing required field: url or title')
            }

            // Reconstruct item
            const page = {
                url:        imported.url,
                title:      imported.title || imported.url,
                favIconUrl: getSiteFaviconUrl(imported.url)
                    || `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(imported.url)}&size=32`,
                date:       imported.timestamp ? new Date(imported.timestamp).getTime() : Date.now(),
                scroll:     imported.scroll || { top: 0, height: 0, percent: '0%' },
                video:      imported.video || { currentTime: 0, playbackRate: 1, percent: '0%' }
            }

            const result = await storage.setSavedPage(page)
            if (result.error) results.usedLocalFallback = true
            results.success++

        } catch (error) {
            results.failed++
            console.error(
                `Import error at ${entry.location}:`,
                error.message,
                '\nContent:',
                entry.source.substring(0, 100)
            )
        }
    }

    return results
}
