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
