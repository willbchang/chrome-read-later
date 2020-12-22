Object.defineProperty(String.prototype, 'isHttp', {
  value:      function () {
    return this.slice(0, 4) === 'http'
  },
  enumerable: false
})

Object.defineProperty(String.prototype, 'isChromeFavicon', {
  value:      function () {
    return this.slice(0, 17) === 'chrome://favicon/'
  },
  enumerable: false
})
