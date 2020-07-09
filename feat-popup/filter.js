import * as action from './action.js'

export const url = target => {
  return {
    A:    () => target.href,
    LI:   () => target.childNodes[3].href,
    SPAN: () => target.previousSibling.previousSibling.href,
    IMG:  () => target.nextElementSibling.href,
  }[target.tagName]()
}


export const li = target => {
  return {
    LI:   () => $(target),
    IMG:  () => $(target.parentNode),
    A:    () => $(target.parentNode),
    SPAN: () => $(target.parentNode),
  }[target.tagName]()
}

export const key = event => {
  const {key, metaKey, altKey} = event
  const lastKey = localStorage.getItem('lastKey')

  const keyBindings = {
    Enter:     metaKey ? 'Meta + Enter' : altKey ? 'Alt + Enter' : 'Enter',
    Backspace: 'Backspace',
    ArrowUp:   'ArrowUp',
    ArrowDown: 'ArrowDown',
    z:         metaKey ? 'Meta + z' : 'z',
    j:         'j',
    k:         'k',
    g:         lastKey === 'g' ? 'gg' : 'g',
    G:         'G',
    d:         lastKey === 'd' ? 'dd' : 'd',
    u:         'u',
    y:         lastKey === 'y' ? 'yy' : 'y',
    p:         'p',
  }

  // Avoid native arrow behavior, it overflows the focus behavior on long reading list.
  if (key.includes('Arrow')) event.preventDefault()
  // Empty Selection on pressing expected key.
  if (key in keyBindings) document.getSelection().empty()

  localStorage.setItem('lastKey', keyBindings[key])
  return keyBindings[key]
}

export const keyAction = event => {
  const target = li(event.target)[0]
  return {
    Enter:          () => action.open({target}),
    'Meta + Enter': () => action.open({target, active: false}),
    'Alt + Enter':  () => action.open({target, currentTab: true}),
    Backspace:      () => action.remove(target),
    'Meta + z':     () => action.restore(),
    ArrowUp:        () => action.up(target),
    ArrowDown:      () => action.down(target),
    j:              () => action.down(target),
    k:              () => action.up(target),
    gg:             () => action.top(),
    G:              () => action.bottom(),
    dd:             () => action.remove(target),
    u:              () => action.restore(),
    yy:             () => action.copy(target),
  }[key(event)]()
}

export const mouse = ({metaKey, altKey}) =>
  metaKey ? 'Meta + Click' : altKey ? 'Alt + Click' : 'Click'

export const mouseAction = (event) => {
  const {target} = event
  if (target.tagName === 'IMG') return action.remove(target)
  return {
    Click:          () => action.open({target}),
    'Meta + Click': () => action.open({target, active: false}),
    'Alt + Click':  () => action.open({target, currentTab: true}),
  }[mouse(event)]()
}
