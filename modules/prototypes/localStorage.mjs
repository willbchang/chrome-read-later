Object.getPrototypeOf(localStorage).getArray = function (key) {
    return JSON.parse(localStorage.getItem(key) || '[]')
}

Object.getPrototypeOf(localStorage).setArray = function (key, item) {
    const items = this.getArray(key)
    items.push(item)
    this.setItem(key, JSON.stringify(items))
}

Object.getPrototypeOf(localStorage).popArray = function (key) {
    const items = this.getArray(key)
    const item = items.pop()
    this.setItem(key, JSON.stringify(items))
    return item
}
