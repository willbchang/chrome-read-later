import * as tabs from "./tabs.js"

Object.prototype.isEmpty = function () {
  return this.url === 'chrome://newtab/'
}

Object.prototype.getInfo = function () {
  return {
    [Date.now()]: {
      url: this.url,
      title: this.title || this.url,
      favIconUrl: this.favIconUrl || '../images/32x32gray.png',
    }
  }
}

Object.prototype.setEmptyOrRemove = function () {
  // query all tabs with {}
  tabs.query({}, aTabs => {
    aTabs.length === 1 ? tabs.empty(this) : tabs.remove(this)
  });
}
