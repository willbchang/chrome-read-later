import * as storage from '../modules/chrome/storage.mjs'
import { setupTooltips } from '../modules/tooltip.mjs'

setupTooltips()

$(async function () {
    const options = await storage.getOptions()
    $('#itemNewTab').prop('checked', options?.itemNewTab)
    $('#keepSavedTab').prop('checked', options?.keepSavedTab)
    $('#itemPopover').prop('checked', options.itemPopover)
    $('#historyMode').prop('checked', options.historyMode)
    await updateStorageControl(options)
})

$('input[type=checkbox]').on('change', async function () {
    const $inputs = $('input[type=checkbox]')
    const $storageStatus = $('#storageStatus')
    const options = {
        itemNewTab:   $('#itemNewTab').prop('checked'),
        keepSavedTab: $('#keepSavedTab').prop('checked'),
        itemPopover:  $('#itemPopover').prop('checked'),
        historyMode:  $('#historyMode').prop('checked'),
        hybrid:       $('#hybrid').prop('checked'),
        isOptions:    true,
    }
    const previousHybrid = this.id === 'hybrid'
        ? !options.hybrid
        : options.hybrid

    $inputs.prop('disabled', true)
    $storageStatus.removeClass('error warning').text('Checking storage...')

    try {
        const result = await storage.setOptions(options)

        if (result.modeError) {
            await updateStorageControl(
                result.options,
                result.options.hybrid
            )
        } else if (result.syncError) {
            await updateStorageControl(result.options)
            $storageStatus.addClass('error').text(
                'Saved on this computer, but Chrome could not sync these options.'
            )
        } else {
            await updateStorageControl(result.options)
        }
    } catch (error) {
        console.error('Read Later: unable to save options.', error)
        $('#hybrid').prop('checked', previousHybrid)
        $storageStatus.addClass('error').text('Could not save these options.')
    } finally {
        $inputs.prop('disabled', false)
        $('#hybrid').prop(
            'disabled',
            $('#hybrid').data('syncUnavailable') === true
        )
    }
})

async function updateStorageControl (options, syncUnavailable = false) {
    const $hybrid = $('#hybrid')
    const $storageStatus = $('#storageStatus')

    if (options.hybrid && !syncUnavailable) {
        try {
            syncUnavailable = await storage.isSyncFull()
        } catch (error) {
            console.warn('Read Later: unable to check Chrome sync storage.', error)
        }
    }

    $hybrid
        .prop('checked', options.hybrid)
        .prop('disabled', syncUnavailable)
        .data('syncUnavailable', syncUnavailable)

    $storageStatus.removeClass('error warning')

    if (syncUnavailable) {
        $storageStatus
            .addClass('warning')
            .text('Chrome Sync is full. New items will be stored locally.')
    } else {
        $storageStatus.text(
            options.hybrid
                ? 'Using Chrome Sync with local overflow.'
                : 'Using Chrome Sync only.'
        )
    }
}
