export function setArray(key, item) {
  const items = JSON.parse(localStorage.getItem(key) || '[]')
  items.push(item)
  localStorage.setItem(key, JSON.stringify(items))
}
