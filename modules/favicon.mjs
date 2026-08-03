export function getSiteFaviconUrl (pageUrl) {
    try {
        const url = new URL(pageUrl)
        if (!['http:', 'https:'].includes(url.protocol)) return ''

        return 'https://t0.gstatic.com/faviconV2' +
            '?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL' +
            `&url=${encodeURIComponent(url.origin)}&size=32`
    } catch {
        return ''
    }
}
