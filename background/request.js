export async function getTitle (url) {
    try {
        const response = await fetch(url)
        const html = await response.text()
        return parseTitle(html) || url
    } catch (e) {
        return url
    }
}

function parseTitle (html) {
    return html.match(/<title>(.*?)<\/title>/)[1]
}
