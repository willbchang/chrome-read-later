import * as storage from '../modules/chrome/storage.mjs'


$(async function () {
    const {options: {itemNewTab, keepSavedTab}} = await storage.sync.get('options')
    $('#itemNewTab').prop('checked', itemNewTab)
    $('#keepSavedTab').prop('checked', keepSavedTab)
})

$('input[type=checkbox]').on('change', async function () {
    const options = {
        itemNewTab:   $('#itemNewTab').prop('checked'),
        keepSavedTab: $('#keepSavedTab').prop('checked'),
        isOptions:    true,
    }
    await storage.sync.set({options})
})
