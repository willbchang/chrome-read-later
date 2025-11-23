import * as storage from '../modules/chrome/storage.mjs'

$(async () => {
    const $textarea = $('#jsonlInput')
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
            if (results.failed === 0) {
                $('#importStatus').html(`<span class="status-success">\u2713 Imported ${results.success} items</span>`)
            } else {
                $('#importStatus').html(
                    `<span class="status-warning">Imported ${results.success} items. ` +
                    `${results.failed} failed - check browser console for details.</span>`
                )
            }
        } catch (error) {
            console.error('Import error:', error.message)
            $('#importStatus').html(`<span class="status-error">Import failed - check browser console for details.</span>`)
        } finally {
            updateButtonState()
        }
    })
})

async function importItems(jsonlContent) {
    const lines = jsonlContent.split('\n')
    const results = {
        success: 0,
        failed: 0
    }

    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim()) { continue }

        try {
            const imported = JSON.parse(lines[i])

            if (!imported.url || !imported.title) {
                throw new Error('Missing required field: url or title')
            }

            // Reconstruct item
            const page = {
                url: imported.url,
                title: imported.title || imported.url,
                favIconUrl: `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(imported.url)}&size=32`,
                date: imported.timestamp ? new Date(imported.timestamp).getTime() : Date.now(),
                scroll: imported.scroll || { top: 0, height: 0, percent: '0%' },
                video: imported.video || { currentTime: 0, playbackRate: 1, percent: '0%' }
            }

            // Save to both storages (like normal save behavior)
            await storage.sync.set(page)
            await storage.local.set(page)
            results.success++

        } catch (error) {
            results.failed++
            console.error(`Import error on line ${1 + i}:`, error.message, '\nContent:', lines[i].substring(0, 100))
        }
    }

    return results
}
