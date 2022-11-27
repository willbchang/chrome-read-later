// For chrome.storage functions:
// https://developer.chrome.com/extensions/storage

class Storage {
    constructor (where) {
        this.storage = chrome.storage[where]
    }

    get (key) {
        return new Promise(resolve => this.storage.get(key, resolve))
    }

    set (page) {
        return new Promise(resolve => {
            const data = page.url ? { [page.url]: page } : page
            this.storage.set(data, resolve)
        })
    }

    remove (url) {
        return this.storage.remove(url)
    }

    clear () {
        return this.storage.clear()
    }

    async getArray (key) {
        const data = await this.get(key)
        return data || []
    }

    async setArray (key, value) {
        const data = await this.getArray(key)
        data.push(value)
        await this.storage.set(key, value)
    }

    async popArray (key) {
        const data = await this.getArray(key)
        const result = data.pop()
        await this.storage.set(key, data)
        return result
    }

    // NOTICE: This returns an Array of objects.
    async sortByLatest () {
        const pages = await this.get()
        return Object.values(pages).
            filter(page => !page.isOptions).
            sort((a, b) => b.date - a.date)
    }

    async getPosition (url) {
        const pages = await this.get()
        const page = pages[url]
        return {
            scroll: {
                top:    page.scroll.top,
                height: page.scroll.height,
            },
            video:  {
                currentTime:  page.video.currentTime,
                playbackRate: page.video.playbackRate,
            },
        }
    }
}

export const sync = new Storage('sync')
export const local = new Storage('local')
export const session = new Storage('session')
