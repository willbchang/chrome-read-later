import '../libraries/dexie.min.js'

// eslint-disable-next-line no-undef
const db = new Dexie('deletedUrls')

db.version(1).stores({
    deletedSyncUrls:  '++id, &url',
    deletedLocalUrls: '++id, &url',
})

export function pushToArray (key, url) {
    db[key].add({ url })
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

export function clear () {
    db.deletedSyncUrls.clear()
    db.deletedLocalUrls.clear()
}
