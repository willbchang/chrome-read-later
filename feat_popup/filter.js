export const url = target => {
  return {
    A: () => target.href,
    LI: () => target.childNodes[3].href,
    SPAN: () => target.previousSibling.previousSibling.href,
    IMG: () => target.nextElementSibling.href,
  }[target.tagName]()
}


export const element = target => {
  return {
    LI: () => target,
    IMG: () => target.parentNode,
  }[target.tagName]()
}

export const key = ({key, metaKey, altKey}, lastKey) => {
  return {
    Enter: () => metaKey ? 'Meta + Enter' : altKey ? 'Alt + Enter' : 'Enter',
    Backspace: () => 'Backspace',
    z: () => metaKey ? 'Command + z' : 'z',
    j: () => 'j',
    k: () => 'k',
    g: () => lastKey === 'g' ? 'gg' : 'g',
    G: () => 'G',
    d: () => lastKey === 'd' ? 'dd' : 'd',
    u: () => 'u',
    y: () => lastKey === 'y' ? 'yy' : 'y',
    p: () => 'p',
  }[key]()
}

export const mouse = ({metaKey, altKey}) =>
  metaKey ? 'Meta + Click' : altKey ? 'Alt + Click' : 'Click'
