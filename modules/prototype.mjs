// jQuery is conflict with prototype, this way works.
// Check empty object: https://stackoverflow.com/a/32108184/9984029
Object.defineProperty(Object.prototype, 'isEmpty', {
  value: function () {
    return Object.entries(this).length === 0 && this.constructor === Object
  },
  enumerable: false
})

Object.defineProperty(String.prototype, 'isMaxLength', {
  value: function () {
    // ul: 300px(width) - 15px*2(padding) = 270px(content width)
    // favicon:  16px(content width) + 5px*2(padding) = 26px(width)
    // li: 270px - 26px = 244px
    // letter-spacing: 0.4px
    // body: font-size: 14px
    // Check: https://jsfiddle.net/2750Lujs
    // The largest letter W has 13px(NOTE: some fonts are not equal width)
    // 244px / 13.4px(letter width) ≈ 18 letters
    // Assume a word is made by W, if the length is larger than 244px,
    // the favicon and the word won't be in the same line,
    // or the word in title will ugly break the line.
    return this.length >= 18
  },
  enumerable: false
})