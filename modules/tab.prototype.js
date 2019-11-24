Object.defineProperty(Object.prototype, 'isEmpty', {
  value: function () {
    return ['chrome://newtab/', 'about:blank'].includes(this.url)
  },
  enumerable: false
})
