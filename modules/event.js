export function onClick(selector, callback) {
  $('ul').on('click', selector, callback)
}

export function onHover(selector, onEnter, onLeave) {
  $(document).on({ mouseenter: onEnter, mouseleave: onLeave }, selector)
}
