Object.prototype.isEmpty = function () {
  return this.url === 'chrome://newtab/'
}

Object.prototype.isHttp = function () {
  return this.url.slice(0, 4) === 'http'
}

Object.prototype.isComplete = function () {
  return this.status === 'complete'
}
