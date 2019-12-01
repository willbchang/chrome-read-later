// jQuery is conflict with prototype, this way works.
// Check empty object: https://stackoverflow.com/a/32108184/9984029
Object.defineProperty(Object.prototype, 'isEmpty', {
  value: function () {
    return Object.entries(this).length === 0 && this.constructor === Object
  },
  enumerable: false
})