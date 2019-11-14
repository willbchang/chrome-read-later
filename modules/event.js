// https://api.jquery.com/on/
export function onClick(selector, callback) {
  $('ul').on('click', selector, callback)
}

// https://api.jquery.com/hover/
// https://stackoverflow.com/a/9827114/9984029
export function onHover(selector, onEnter, onLeave) {
  $('ul').on({ mouseenter: onEnter, mouseleave: onLeave }, selector)
}
