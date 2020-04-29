export function setArray(key, item) {
  const items = JSON.parse(localStorage.getItem(key) || '[]')
  items.push(item)
  localStorage.setItem(key, JSON.stringify(items))
}

export function popArray(key) {
  const items = JSON.parse(localStorage.getItem(key) || '[]')
  const item = items.pop()
  localStorage.setItem(key, JSON.stringify(items))
  return item
}
