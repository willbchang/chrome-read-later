import * as storage from '../modules/chrome/storage.mjs'


$(async function () {
    const {options} = await storage.sync.get('options')
    if (options.itemNewTab) $('#itemNewTab').prop('checked', true)
})

$('#itemNewTab').on('change', async function () {
    const options = {
        itemNewTab: $(this).prop('checked'),
        isOptions:  true,
    }
    await storage.sync.set({options})
})
