import * as action from './action.js'

export const getKeyBinding = event => {
  const {key, metaKey, altKey} = event

  const keyBindings = {
    Enter:     metaKey ? 'Meta + Enter' : altKey ? 'Alt + Enter' : 'Enter',
    Backspace: 'Backspace',
    ArrowUp:   metaKey ? 'Meta + ArrowUp' : 'ArrowUp',
    ArrowDown: metaKey ? 'Meta + ArrowDown' : 'ArrowDown',
    z:         metaKey ? 'Meta + z' : 'z',
    j:         'j',
    k:         'k',
    g:         window.lastKey === 'g' ? 'gg' : 'g',
    G:         'G',
    d:         window.lastKey === 'd' ? 'dd' : 'd',
    u:         'u',
    y:         window.lastKey === 'y' ? 'yy' : 'y',
    p:         'p',
  }

  window.lastKey = keyBindings[key]
  return keyBindings[key]
}
export const getKeyAction = keyBinding => {
  return {
    Enter:              () => action.open({}),
    'Meta + Enter':     () => action.open({active: false}),
    'Alt + Enter':      () => action.open({currentTab: true}),
    Backspace:          () => action.dele(),
    'Meta + z':         () => action.undo(),
    'Meta + ArrowUp':   () => action.moveTo('top'),
    'Meta + ArrowDown': () => action.moveTo('bottom'),
    ArrowUp:            () => action.moveTo('previous'),
    ArrowDown:          () => action.moveTo('next'),
    j:                  () => action.moveTo('next'),
    k:                  () => action.moveTo('previous'),
    gg:                 () => action.moveTo('top'),
    G:                  () => action.moveTo('bottom'),
    dd:                 () => action.dele(),
    u:                  () => action.undo(),
    yy:                 () => action.copyUrl(),
  }[keyBinding]
}
export const getModifiedClick = ({metaKey, altKey}) =>
  metaKey ? 'Meta + Click' : altKey ? 'Alt + Click' : 'Click'
export const getClickAction = (modifiedClick, tagName) => {
  if (tagName === 'IMG') return action.dele()
  return {
    Click:          () => action.open({}),
    'Meta + Click': () => action.open({active: false}),
    'Alt + Click':  () => action.open({currentTab: true}),
  }[modifiedClick]
}