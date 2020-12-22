import '../../modules/libraries/jquery.min.js'

export async function getTitle(url) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return $(html).filter('title').text() || url
  } catch (e) {
    return url
  }
}
