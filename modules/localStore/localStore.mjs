import '../libraries/dexie.min.js'

// eslint-disable-next-line no-undef
const db = new Dexie('deletedUrls')

db.version(1).stores({
    deletedSyncUrls:  '++id, &url',
    deletedLocalUrls: '++id, &url',
})

db.version(2).stores({
    deletedSyncUrls:       '++id, &url',
    deletedLocalUrls:      '++id, &url',
    deletedLocalSavedUrls: '++id, &url',
})

db.version(3).stores({
    deletedSyncUrls:       '++id, &url',
    deletedLocalUrls:      '++id, &url',
    deletedHybridUrls:     '++id, &url',
    deletedLocalSavedUrls: null,
})

db.version(4).stores({
    deletedSyncUrls:       '++id, &url',
    deletedLocalUrls:      '++id, &url',
    deletedHybridUrls:     null,
    deletedLocalSavedUrls: null,
})

export function pushToArray (key, url) {
    const table = key === 'deletedHybridUrls'
        ? db.deletedSyncUrls
        : db[key]
    table.add({ url })
}

export function getArray (key) {
    return db[key]
        .orderBy('url')
        .keys()
}

export async function popArray (key) {
    const { id, url } = await db[key]
        .orderBy('id')
        .last()

    db[key].delete(id)

    return url
}

export async function clear () {
    await Promise.all([
        db.deletedSyncUrls.clear(),
        db.deletedLocalUrls.clear(),
    ])
}
