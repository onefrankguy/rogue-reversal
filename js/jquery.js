;(function () {
'use strict';

function Fn (selector) {
  if (selector instanceof Fn) {
    return selector
  }

  this.element = selector

  if (typeof selector === 'string') {
    if (selector.indexOf('#') === 0) {
      this.element = document.getElementById(selector.slice(1))
    }
  }

  return this
}

Fn.prototype.add = function (klass) {
  if (this.element) {
    this.element.classList.add(klass)
  }
  return this
}

Fn.prototype.remove = function (klass) {
  if (this.element) {
    this.element.classList.remove(klass)
  }
  return this
}

function root (selector) {
  return new Fn(selector)
}

window.jQuery = root
})()
