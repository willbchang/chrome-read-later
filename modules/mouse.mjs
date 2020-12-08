import * as action from './domActions.mjs'

export const getModifiedClick = ({metaKey, altKey}) =>
  metaKey ? 'Meta + Click' : altKey ? 'Alt + Click' : 'Click'

export const getClickAction = (event) => {
  const {target} = event
  if (target.tagName === 'IMG') return action.dele()
  return {
    Click:          () => action.open({}),
    'Meta + Click': () => action.open({active: false}),
    'Alt + Click':  () => action.open({currentTab: true}),
  }[getModifiedClick(event)]()
}