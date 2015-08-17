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

Fn.prototype.html = function (value) {
  if (this.element) {
    if (value === undefined) {
      return this.element.innerHTML;
    }
    this.element.innerHTML = value
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

Fn.prototype.toggle = function (klass) {
  if (this.element) {
    this.element.classList.toggle(klass)
  }
  return this
}

Fn.prototype.touch = function (start, end) {
  var self = this
  if (this.element) {
    if ('ontouchstart' in document.documentElement === false) {
      this.element.onmousedown = function (event) {
        if (start) {
          start(self)
        }
        document.onmousemove = function (event) {
          event.preventDefault()
        }
        document.onmouseup = function (event) {
          if (end) {
            end(self)
          }
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    } else {
      this.element.ontouchstart = function (event) {
        if (start) {
          start(self)
        }
        document.ontouchmove = function (event) {
          event.preventDefault()
        }
        document.ontouchend = function (event) {
          if (end) {
            end(self)
          }
          document.ontouchmove = null
          document.ontouchend = null
        }
      }
    }
  }
  return this
}

Fn.prototype.unwrap = function () {
  return this.element
}

function root (selector) {
  return new Fn(selector)
}

window.jQuery = root
})()
