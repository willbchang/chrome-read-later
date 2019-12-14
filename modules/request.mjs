import '../modules_web/jquery.min.js'

export async function getHtml(url) {
  try {
    const data = await $.get(url)
    return $($.parseHTML(data))
  } catch (e) {
    return $('')
  }
}
