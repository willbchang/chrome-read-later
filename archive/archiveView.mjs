export function filterArchivePages (pages, query) {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    if (!normalizedQuery) return [...pages]

    return pages.filter(page => {
        const searchableText = `${page.title || ''}\n${page.url || ''}`
            .toLocaleLowerCase()
        return searchableText.includes(normalizedQuery)
    })
}

export function getDisplayUrl (pageUrl) {
    try {
        const url = new URL(pageUrl)
        return `${url.hostname}${url.pathname === '/' ? '' : url.pathname}`
    } catch {
        return pageUrl
    }
}

export function getArchiveProgress (page) {
    const videoPercent = page.video?.percent
    if (videoPercent && !['0%', '100%'].includes(videoPercent)) {
        return { label: `Video ${videoPercent}`, type: 'video' }
    }

    const scrollPercent = page.scroll?.percent
    if (page.scroll?.top && scrollPercent) {
        return { label: `Read ${scrollPercent}`, type: 'reading' }
    }
}
