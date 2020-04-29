export function getArray(key) {
  return JSON.parse(localStorage.getItem(key) || '[]')
}

export function setArray(key, item) {
  const items = getArray(key)
  items.push(item)
  localStorage.setItem(key, JSON.stringify(items))
}

export function popArray(key) {
  const items = getArray(key)
  const item = items.pop()
  localStorage.setItem(key, JSON.stringify(items))
  return item
}
