import '../modules_web/jquery.min.js'

function setupAjax() {
  // https://git.io/Je7tD
  $.ajaxSetup({
    beforeSend(jqXHR) {
      jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    }
  })
}

export async function getHtml(url) {
  setupAjax()
  try {
    url = 'https://cors-anywhere.herokuapp.com/' + url
    const data = await $.get(url)
    return $($.parseHTML(data))
  } catch (e) {
    return $('')
  }
}

export async function getTitle(url) {
  const html = await getHtml(url)
  return html.filter('title').text() || url
}
