import '../../libraries/jquery.min.js'

export async function getTitle(url) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return $(html).filter('title').text() || url
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
    return '../../assets/icons/logo-gray32x32.png'
  }
}

// https://www.google.com/search?q=test => www.google.com
function getDomain(url) {
  return new URL(url).hostname
}


export async function toBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return await fileReader(blob)
  } catch (e) {
    return '../images/32x32gray.png'
  }
}

async function fileReader(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
