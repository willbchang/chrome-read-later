Object.defineProperty(String.prototype, 'isHttp', {
  value: function () {
    return this.slice(0, 4) === 'http'
  },
  enumerable: false
})
