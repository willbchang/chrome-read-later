Object.defineProperty(Object.prototype, 'isEmpty', {
  value: function () {
    return ['chrome://newtab/', 'about:blank'].includes(this.url)
  },
  enumerable: false
})

Object.defineProperty(Object.prototype, 'isHttp', {
  value: function () {
    return this.url.slice(0, 4) === 'http'
  },
  enumerable: false
})
