import * as action from './domActions.mjs'

export const getKeyBinding = event => {
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

  localStorage.setItem('lastKey', keyBindings[key])
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

export function handleKeyDownOn(selector) {
  selector.on('keydown', event => {
    try {
      const keyBinding = getKeyBinding(event)
      const keyAction = getKeyAction(keyBinding)
      keyAction()
    } catch (e) {
      console.log('Catch default key action: ', event.key)
    }
  })
}