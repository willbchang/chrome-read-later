import * as action from './action.js'


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
    ArrowUp:   metaKey ? 'Meta + ArrowUp' : 'ArrowUp',
    ArrowDown: metaKey ? 'Meta + ArrowDown' : 'ArrowDown',
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

  // Empty Selection on pressing expected key.
  if (key in keyBindings) document.getSelection().empty()

  localStorage.setItem('lastKey', keyBindings[key])
  return keyBindings[key]
}

export const keyAction = event => {
  // Avoid native arrow behavior, it overflows the focus behavior on long reading list.
  if (event.key.includes('Arrow')) event.preventDefault()

  return {
    Enter:              () => action.open({}),
    'Meta + Enter':     () => action.open({active: false}),
    'Alt + Enter':      () => action.open({currentTab: true}),
    Backspace:          () => action.remove(),
    'Meta + z':         () => action.undo(),
    'Meta + ArrowUp':   () => action.top(),
    'Meta + ArrowDown': () => action.bottom(),
    ArrowUp:            () => action.up(),
    ArrowDown:          () => action.down(),
    j:                  () => action.down(),
    k:                  () => action.up(),
    gg:                 () => action.top(),
    G:                  () => action.bottom(),
    dd:                 () => action.remove(),
    u:                  () => action.undo(),
    yy:                 () => action.copy(),
  }[key(event)]()
}

export const mouse = ({metaKey, altKey}) =>
  metaKey ? 'Meta + Click' : altKey ? 'Alt + Click' : 'Click'

export const mouseAction = (event) => {
  const {target} = event
  if (target.tagName === 'IMG') return action.remove()
  return {
    Click:          () => action.open({}),
    'Meta + Click': () => action.open({active: false}),
    'Alt + Click':  () => action.open({currentTab: true}),
  }[mouse(event)]()
}
