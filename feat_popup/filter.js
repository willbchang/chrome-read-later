export const url = target => {
  return {
    A: () => target.href,
    LI: () => target.childNodes[3].href,
    SPAN: () => target.previousSibling.previousSibling.href,
    IMG: () => target.nextElementSibling.href,
  }[target.tagName]()
}


export const remove = target => {
  return {
    LI: () => target.remove(),
    IMG: () => target.parentNode.remove(),
  }[target.tagName]()
}
