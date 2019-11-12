export function onClick(selector, callback) {
  $('ul').on('click', selector, callback)
}
