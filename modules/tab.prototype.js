import * as tabs from "./tabs.js"

// Use Object.defindeProperty to resolve confict with jQuery
// https://stackoverflow.com/a/21730003/9984029
Object.defineProperty(Object.prototype, 'isEmpty', {
  value: function () { return this.url === 'chrome://newtab/' },
  enumerable: false
})

Object.defineProperty(Object.prototype, 'getInfo', {
  value: function () {
    return {
      [Date.now()]: {
        url: this.url,
        title: this.title || this.url,
        favIconUrl: this.favIconUrl || '../images/32x32gray.png',
      }
    }
  },
  enumerable: false
})

Object.defineProperty(Object.prototype, 'setEmptyOrRemove', {
  value: function () {
    // query all tabs with {}
    tabs.query({}, aTabs => {
      aTabs.length === 1 ? tabs.empty(this) : tabs.remove(this)
    })
  },
  enumerable: false
})