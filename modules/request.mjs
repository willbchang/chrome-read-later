import '../modules_web/jquery.min.js'

export async function getTitle(url) {
  const html = await getHtml(url)
  return html.filter('title').text() || url
}

export async function getHtml(url) {
  setupAjax()
  try {
    const data = await $.get(cors(url))
    return $($.parseHTML(data))
  } catch (e) {
    return $('')
  }
}

function setupAjax() {
  // https://git.io/Je7tD
  $.ajaxSetup({
    beforeSend(jqXHR) {
      jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    }
  })
}

function cors(url) {
  return 'https://cors-anywhere.herokuapp.com/' + url
}

export async function getFavIcon(url) {
  return cors(`https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
}
