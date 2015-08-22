var ColorWheel = (function () {
'use strict';

var colors = {}
  , wheel = []
  , cw = {}

/* http://colllor.com/ */
/* 0 Hues are pure color. */
/* 1 Tints are hue plus white. */
/* 2 Tones are hue plus gray. */
/* 4 Shades are hue plus black. */
colors = {
    'yellow':        ['#fff400','#fff75c','#f2e70d','#b8ae00']
  , 'yellow-orange': ['#ffd300','#ffe047','#f2cc0d','#b89900']
  , 'orange':        ['#fda500','#ffb833','#f2a20d','#b87700']
  , 'red-orange':    ['#f58351','#f79e78','#dc6938','#c1420b']
  , 'red':           ['#ed2324','#f2674a','#bb191a','#aa0e0e']
  , 'red-violet':    ['#8c288f','#9f5da6','#791a7e','#4e1650']
  , 'violet':        ['#5a2e91','#7756a5','#4f237f','#30184e']
  , 'blue-violet':   ['#3e3997','#645dab','#2f2978','#242259']
  , 'blue':          ['#0450a5','#6379bc','#013f85','#022650']
  , 'blue-green':    ['#00ab85','#00cca0','#09a583','#006650']
  , 'green':         ['#14a049','#16b653','#248f4d','#0b5b2a']
  , 'yellow-green':  ['#90c841','#a2d161','#8db654','#648e29']
}

wheel = [
  'yellow','yellow-orange','orange','red-orange',
  'red','red-violet','violet','blue-violet',
  'blue','blue-green','green','yellow-green'
]

cw.hue = function (color) {
  return colors[color][0] + 'ff'
}

cw.tint = function (color) {
  return colors[color][1] + 'ff'
}

cw.tone = function (color) {
  return colors[color][2] + 'ff'
}

cw.shade = function (color) {
  return colors[color][3] + 'ff'
}

cw.left = function (color, amount) {
  var index = wheel.indexOf(color)
  for (; amount > 0; amount -= 1) {
    index += 1
    if (index >= wheel.length) {
      index = 0
    }
  }
  return wheel[index]
}

cw.right = function (color, amount) {
  var index = wheel.indexOf(color)
  amount = amount || 0
  for (; amount > 0; amount -= 1) {
    index -= 1
    if (index < 0) {
      index = wheel.length - 1
    }
  }
  return wheel[index]
}

return cw
}())

var ImageCache = (function () {
'use strict';

var $ = window.jQuery
  , canvas = $('#gfx').unwrap()
  , ctx = canvas.getContext('2d')
  , images = {}
  , ic = {}

images['mannequin'] = {"width":16,"height":24,"data":"67a2b7a2b4a2b1c1b5a1b2c1b3a1b3c5b1d2c1b3a1b3c6d2c1b3a1b1c1b1c2d2e2d1b1c1b3a1b1c1b1c1d2e3d1b1c1b3a1b1c1b1c1d2e2d1e1b1c1b3a1b1c1b2c1d1e2d1e1b1c1b4a2b3c3d1e2b6a1b6c1e1b7a1f7b1f7a1f7g1f7a1f2g1h4g1f7a1f1g1h1f1a1f1h1g1f7a1f1g1h1f1a1f1h1g1f7a1f1g1h1f1a1f1h1g1f7a1f1g1h1f1a1f1h2f7a1i2g1i1a1f1h2f6a2i2f1i1a2i1f2i5a5i1a5i2a","values":{"a":"#00000000","b":"#afafafff","c":"#d0d0d0ff","d":"#ecececff","e":"#ffffffff","f":"#414141ff","g":"#606060ff","h":"#848484ff","i":"#1b1b1bff"}}

/*
 * mannequin
 * a = background
 * b = shirt outline
 * c = shirt base
 * d = shirt highlight 1
 * e = shirt highlight 2
 * f = pants outline
 * g = pants base
 * h = pants highlight
 * i = shoes
 */

function hexToRgba (hex) {
  var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[4], 16),
  } : null
}

ic.getDataURL = function (name, options) {
  var data = images[name]
    , image = ctx.createImageData(data.width, data.height)
    , i = 0
    , j = 0
    , x = 0
    , y = 0
    , offset = 0
    , color = null
    , value = ''
    , number = ''

  options = options || {}
  if (options.hasOwnProperty('shirt')) {
    color = options['shirt']
    switch (name) {
      case 'mannequin':
        data.values.b = ColorWheel.shade(color)
        data.values.c = ColorWheel.tone(color)
        data.values.d = ColorWheel.hue(color)
        data.values.e = ColorWheel.tint(color)
        break
    }
  }

  if (options.hasOwnProperty('pants')) {
    color = options['pants']
    switch (name) {
      case 'mannequin':
        data.values.f = ColorWheel.shade(color)
        data.values.g = ColorWheel.tone(color)
        data.values.h = ColorWheel.hue(color)
        break
    }
  }

  if (options.hasOwnProperty('shoes')) {
    color = options['shoes']
    switch (name) {
      case 'mannequin':
        data.values.i = ColorWheel.hue(color)
        break
    }
  }

  canvas.width = data.width
  canvas.height = data.height

  for (i = 0; i < data.data.length; i += 1) {
    value = data.data[i]
    if (value.charCodeAt() >= 'a'.charCodeAt() && value.charCodeAt() <= 'z'.charCodeAt()) {
      number = parseInt(number, 10)
      color = hexToRgba(data.values[value])
      for (j = 0; j < number; j += 1) {
        offset = (y*(image.width*4)) + (x*4)
        image.data[offset + 0] = color.r
        image.data[offset + 1] = color.g
        image.data[offset + 2] = color.b
        image.data[offset + 3] = color.a
        x += 1
        if (x >= image.width) {
          x = 0
          y += 1
        }
        if (y >= image.height) {
          y = 0
        }
      }
      number = ''
    } else {
      number += value
    }
  }


  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL()
}

return ic
}())

var Weapon = (function () {
'use strict';

var $ = window.jQuery
  , w = {}
  , element = $('#weapon')
  , start = { y: 0 }
  , end = { y: 0 }
  , dirty = 0

w.render = function () {
  if (dirty === 1) {
    element.top(start.y)
    element.remove('hidden')
    dirty = 2
  } else if (dirty === 2) {
    element.animate('fire', function () {
      element.add('hidden')
      dirty = 0
    })
    element.top(end.y)
    dirty = 3
  }
  return this
}

w.moving = function () {
  return dirty > 0
}

w.fire = function (s, e) {
  start = s
  end = e
  dirty = 1
  return this
}

w.box = function () {
  return element.box()
}

return w
}())

var Target = (function () {
'use strict';

var $ = window.jQuery
  , t = {}
  , element = $('#target')

t.render = function () {
  return this
}

t.box = function () {
  return element.box()
}

return t
}())

var Items = (function () {
'use strict';

var $ = window.jQuery
  , o = {}
  , items = {}
  , active = 'bow'
  , dirty = false

items['bow'] = $('#bow')
items['sword'] = $('#sword')
items['potion'] = $('#potion')
items['key'] = $('#key')

o.render = function () {
  var key = 0

  if (dirty) {
    for (key in items) {
      if (items.hasOwnProperty(key)) {
        if (key === active) {
          items[key].add('picked')
        } else {
          items[key].remove('picked')
        }
      }
    }
    dirty = false
  }

  return this
}

o.pick = function (item) {
  active = item
  dirty = true
}

o.picked = function () {
  return active
}

return o
}())

var Player = (function () {
'use strict';

var $ = window.jQuery
  , p = {}
  , element = $('#player')
  , row = 0
  , dirty = false

p.render = function () {
  var wbox = null
    , tbox = null
    , wpoint = null
    , tpoint = null
    , hit = ''
    , item = null

  dirty &= Weapon.moving()
  if (dirty) {
    wbox = Weapon.box()
    tbox = Target.box()
    wpoint = { x: wbox.left + (wbox.width / 2), y: wbox.top }
    tpoint = { x: tbox.left + (tbox.width / 2), y: tbox.top + tbox.height }

    if (wpoint.y <= tbox.top &&
        wpoint.x >= tbox.left - (wbox.width * 2) &&
        wpoint.x <= tbox.right + (wbox.width * 2)) {
      if (wpoint.x >= tpoint.x - (wbox.width * 1) && wpoint.x <= tpoint.x + (wbox.width * 1)) {
        hit = 'perfect'
      } else if (wpoint.x >= tbox.left && wpoint.x <= tbox.right) {
        hit = 'close'
      } else if (wpoint.x < tbox.left) {
        hit = 'left'
      } else if (wpoint.x > tbox.right) {
        hit = 'right'
      }
    }

    if (hit !== '') {
      item = Items.picked()
      if (item === 'bow') {
        if (row === 0) {
          if (hit === 'perfect') {
            console.log('You score a perfect hit with your bow and leap forward.')
          } else if (hit === 'close') {
            console.log('You score a hit with your bow and step forward.')
          } else if (hit === 'left') {
            console.log('You miss with your bow and adjust your aim to the left.')
          } else if (hit === 'right') {
            console.log('You miss with your bow and adjust your aim to the right.')
          }
        }
      }
    }

    dirty = (hit === '')
  }

  return this
}

p.fire = function (s, e) {
  Weapon.fire(s, e)
  dirty = true
  console.log('You fire your bow at the door.')
  return this
}

return p
}())

;(function (Game) {
'use strict';

var activeMannequin = null
function onMannequin (target) {
  target.toggle('on')
  activeMannequin = target
}

function offMannequin (target) {
  var $ = window.jQuery
  $('#picker').toggle('on')
}

function onPicker (target) {
  target.toggle('on')
}

function offPicker (target) {
  var $ = window.jQuery
    , i = 0
    , j = 0

  for (i = 1; i <= 3; i += 1) {
    for (j = 1; j <= 4; j += 1) {
      $('#mannequin'+i+j).remove('on')
    }
  }
}

function onColor (target, e) {
  e.stopPropagation()
  var $ = window.jQuery
    , color = target.unwrap().id
    , mannequin = $('#'+activeMannequin.unwrap().id+'-img')
  mannequin.unwrap().src = ImageCache.getDataURL('mannequin', {
    'shirt': color
  , 'pants': ColorWheel.left(color, 2)
  , 'shoes': ColorWheel.right(color, 4)
  })
}

function onFire (target, e) {
  if (Weapon.moving()) {
    return
  }
  Player.fire({ y: 218 }, { y: -8 })
}

function onItem (target, e) {
  Items.pick(target.unwrap().id)
}

function render () {
  requestAnimationFrame(render)
  Weapon.render()
  Target.render()
  Items.render()
  Player.render()
}

function startGame (callback) {
  requestAnimationFrame(callback)
}

Game.play = function () {
  var $ = window.jQuery

  $('#weapon').top(340)
  $('#room').touch(onFire, null)
  $('#bow').touch(onItem, null)
  $('#sword').touch(onItem, null)
  $('#potion').touch(onItem, null)
  $('#key').touch(onItem, null)

  startGame(render)
}

})(window.Game = window.Game || {})
