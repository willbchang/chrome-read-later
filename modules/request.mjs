import '../modules_web/jquery.min.js'

export async function getTitle(url) {
  const html = await getHtml(url)
  return html.filter('title').text() || url
}

export async function getHtml(url) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    return $(html)
  } catch (e) {
    return $('')
  }
}

export async function getFavIcon(url) {
  return await toDataUrl(`https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
}

async function toDataUrl(url) {
  const response = await corsFetch(url)
  const blob = await response.blob()
  return await fileReader(blob)
}

async function corsFetch(url) {
  return await fetch(cors(url), {headers: setupHeaders()})
}

function setupHeaders() {
  const headers = new Headers()
  headers.append('X-Requested-With', 'XMLHttpRequest')
  return headers
}

function cors(url) {
  return 'https://cors-anywhere.herokuapp.com/' + url
}

async function fileReader(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}