import '../modules_web/jquery.min.js'

export async function getTitle(url) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return $(html).filter('title').text()
  } catch (e) {
    return url
  }
}

export async function getFavIcon(url) {
  try {
    const response = await fetch(`https://favicongrabber.com/api/grab/${getDomain(url)}`)
    const data = await response.json()
    return data.icons[0].src
  } catch (e) {
    return '../icons/logo-gray32x32.png'
  }
}

// https://www.google.com/search?q=test => www.google.com
function getDomain(url) {
  return new URL(url).hostname
}
