var Emote = (function () {
'use strict';

var $ = window.jQuery
  , e = {}
  , element = $('#emote')
  , start = { x: 128, y: 136 }
  , text = ''
  , dirty = false

e.reset = function () {
  text = ''
  dirty = true
}

e.render = function () {
  if (dirty) {
    if (text === '') {
      element.add('hidden')
    } else {
      element.top(start.y)
      element.left(start.x)
      element.html(text)
      element.remove('hidden')
    }
    dirty = false
  }
}

e.move = function (s) {
  if (s.hasOwnProperty('x') && start.x !== s.x) {
    start.x = s.x
    dirty = true
  }
  if (s.hasOwnProperty('y') && start.y !== s.y) {
    start.y = s.y - 24
    dirty = true
  }
}

e.say = function (html) {
  text = html
  dirty = true
}

return e
}())

var Room = (function () {
'use strict';

var r = {}
  , num_rows = 6
  , num_cols = 10
  , tile_width = 32
  , tile_height = 32
  , last_row = num_rows - 3
  , last_col = num_cols - 1

function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

r.is_last_row = function (row) {
  return row === last_row
}

r.clamp_row = function (row) {
  if (row < 0) {
    return 0
  }
  if (row > last_row) {
    return last_row
  }
  return row
}

r.clamp_col = function (col) {
  if (col < 0) {
    return 0
  }
  if (col > last_col) {
    return last_col
  }
  return col
}

r.move_row = function (row) {
  return (num_rows - row - 1) * tile_height
}

r.move_col = function (col) {
  return (col * tile_width)
}

r.random_tile = function (box) {
  var row = getRandomIntInclusive(0, last_row)
    , col = getRandomIntInclusive(0, last_col)
    , x = this.move_col(col)
    , y = this.move_row(row)
  return { top: y, left: x, width: box.width, height: box.height, right: x + box.width, bottom: y + box.height }
}

r.intersect = function (box1, box2) {
  return !(box2.left >= box1.right ||
           box2.right <= box1.left ||
           box2.top >= box1.bottom ||
           box2.bottom <= box1.top)
}

return r
}())

var Key = (function () {
'use strict';

var $ = window.jQuery
  , k = {}
  , element = $('#pickup-key')
  , position = { top: 0, left: 0 }
  , held = true
  , dirty = false

k.render = function () {
  if (dirty) {
    if (held) {
      element.add('hidden')
    } else {
      element.top(position.top)
      element.left(position.left)
      element.remove('hidden')
    }
    dirty = false
  }
}

k.pickup = function (offset) {
  if (!held && Room.intersect(offset, position)) {
    Items.pickup('key')
    held = true
    dirty = true
  }
  return this
}

k.discard = function () {
  if (held) {
    Items.discard('key')
    held = false
    position = Room.random_tile({ width: 32, height: 32 })
    dirty = true
  }
  return this
}

k.held = function () {
  return held
}

return k
}())

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
  , start = { x: 0, y: 0 }
  , item = null
  , dirty = 0

w.render = function () {
  if (dirty === 1) {
    element.top(start.y)
    element.left(start.x)
    element.remove('bow')
    element.remove('sword')
    element.remove('potion')
    element.remove('key')
    element.add(item)
    element.remove('hidden')
    dirty = 2
  } else if (dirty === 2) {
    element.animate(Player.animation(), function () {
      element.add('hidden')
      dirty = 0
    })
    dirty = 3
  }
  return this
}

w.moving = function () {
  return dirty > 0
}

w.fire = function (i, s) {
  item = i
  start = s
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
  , start = { x: 144, y: 0 }
  , speeds = []
  , speed = null
  , health = 1
  , dirty = 0

speeds.push('slow')
speeds.push('fast')

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

t.render = function () {
  var i = 0

  if (dirty === 1) {
    if (speed !== null) {
      for (i = 0; i < speeds.length; i += 1) {
        element.remove(speeds[i])
      }
      element.add('horizontal')
      element.add(speed)
      speed = null
    }
    element.top(start.y)
    element.left(start.x)
    dirty = 0
  } else if (dirty === 2) {
    element.remove('horizontal')
    element.animate('away', function () {
      Target.reset()
      Player.reset()
    })
    dirty = 3
  }

  return this
}

t.box = function () {
  return element.box()
}

t.move = function (s) {
  if (s.hasOwnProperty('x') && start.x !== s.x) {
    start.x = s.x
    dirty = 1
  }
  if (s.hasOwnProperty('y') && start.y !== s.y) {
    start.y = s.y
    dirty = 1
  }
}

t.moving = function () {
  return dirty >= 2
}

t.hit = function () {
  health -= 1
  if (health <= 0) {
    health = 0
    dirty = 2
  }
}

t.reset = function () {
  start = { x: 144, y: 0 }
  speed = speeds[getRandomInt(0, speeds.length)]
  health = 1
  dirty = 1
}

return t
}())

var Items = (function () {
'use strict';

var $ = window.jQuery
  , o = {}
  , element = $('#item')
  , items = ['sword', 'bow', 'potion', 'key']
  , inventory = ['sword', 'bow', 'potion', 'key']
  , active = 0
  , dirty = false

o.render = function () {
  var i = 0

  if (dirty) {
    for (i = 0; i < items.length; i += 1) {
      element.remove(items[i])
    }
    element.add(inventory[active])
    dirty = false
  }

  return this
}

o.next = function () {
  active += 1
  if (active >= inventory.length) {
    active = 0
  }
  dirty = true
}

o.picked = function () {
  return inventory[active]
}

o.pickup = function (item) {
  inventory.push(item)
}

o.discard = function (item) {
  var index = inventory.indexOf(item)
  if (index > -1) {
    inventory.splice(index, 1)
    if (active >= inventory.length) {
      active = 0
    }
    dirty = true
  }
}

return o
}())

var Player = (function () {
'use strict';

var $ = window.jQuery
  , p = {}
  , element = $('#character')
  , row = 0
  , col = 4
  , item = null
  , dirty = 0

/*
 * Player states:
 * 0 - Nothing needs to be updated.
 * 1 - Weapon fired! Animation time.
 * 2 - Weapon moving. Need to perform a hit test.
 * 3 - Need to move player.
 */
p.render = function () {
  var wbox = null
    , tbox = null
    , wpoint = null
    , tpoint = null
    , hit = ''
    , weapon_width = 8

  if (dirty === 1) {
    element.animate('attack')
    dirty = 2
  } else if (dirty === 2) {
    wbox = Weapon.box()
    tbox = Target.box()
    wpoint = { x: wbox.left + (wbox.width / 2), y: wbox.top }
    tpoint = { x: tbox.left + (tbox.width / 2), y: tbox.top }

    if (wpoint.y > tpoint.y) {
      dirty = 2
      return this
    }

    dirty = 3
    hit = 'miss'

    if (wpoint.x >= tbox.left - (weapon_width * 4) && wpoint.x <= tbox.right + (weapon_width * 4)) {
      if (wpoint.x >= tpoint.x - (weapon_width * 1) && wpoint.x <= tpoint.x + (weapon_width * 1)) {
        hit = 'perfect'
      } else if (wpoint.x >= tbox.left && wpoint.x <= tbox.right) {
        hit = 'close'
      } else if (wpoint.x < tbox.left) {
        hit = 'left'
      } else if (wpoint.x > tbox.right) {
        hit = 'right'
      }
    }

    if (item === 'bow') {
      if (hit === 'perfect') {
        if (Room.is_last_row(row)) {
          Target.hit()
        }
        row -= 1
        Emote.say('Yes!')
      } else if (hit === 'close') {
        if (Room.is_last_row(row)) {
          Target.hit()
        }
        row -= 1
        Emote.say('Bam!')
      } else if (hit === 'left') {
        col += 1
        Emote.say('Hmm&hellip;')
      } else if (hit === 'right') {
        col -= 1
        Emote.say('Rats.')
      } else {
        row -= 1
        Emote.say('Oof!')
      }
    } else if (item === 'sword') {
      if (hit === 'perfect') {
        if (Room.is_last_row(row)) {
          Target.hit()
        }
        row += 1
        Emote.say('Ha!')
      } else if (hit === 'close') {
        if (Room.is_last_row(row)) {
          Target.hit()
        }
        row += 1
        Emote.say('Bam!')
      } else if (hit === 'left') {
        col -= 1
        Emote.say('Rats.')
      } else if (hit === 'right') {
        col += 1
        Emote.say('Hmm&hellip;')
      } else {
        Emote.say('')
      }
    } else if (item === 'potion') {
      if (hit !== 'miss') {
        Emote.say('Yum!')
      } else {
        Emote.say('')
      }
    } else if (item === 'key') {
      if (Room.is_last_row(row)) {
        if (hit === 'perfect' || hit === 'close') {
          Emote.say('Click!')
        } else if (hit === 'left' || hit === 'right') {
          Emote.say('Hmm&hellip;')
        } else {
          Emote.say('Rats.')
        }
      } else {
        Key.discard()
        Emote.say('Whoops.')
      }
    }
  } else if (dirty === 3) {
    row = Room.clamp_row(row)
    element.top(Room.move_row(row))

    col = Room.clamp_col(col)
    element.left(Room.move_col(col))

    Target.move({ x: element.left() })
    Emote.move({ x: element.left(), y: element.top() })

    if (!Key.held() && Key.pickup(element.box()).held()) {
      Emote.say('Got it!')
    }

    dirty = 0
  }

  return this
}

p.reset = function () {
  Emote.reset()
  row = 0
  col = 4
  item = null
  dirty = 3
}

p.fire = function () {
  /* Record the item when the weapon's fired in case the user swaps. */
  item = Items.picked()

  if (item === 'key' && !Key.held()) {
    Emote.say('I need the key.')
    return this
  }

  Weapon.fire(item, { x: Room.move_col(col), y: Room.move_row(row) })
  dirty = 1
  return this
}

p.animation = function () {
  return item+'-row'+row
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
  if (Weapon.moving() || Target.moving()) {
    return
  }
  Player.fire()
}

function onItem (target, e) {
  Items.next()
}

function render () {
  requestAnimationFrame(render)
  Weapon.render()
  Target.render()
  Key.render()
  Items.render()
  Player.render()
  Emote.render()
}

function startGame (callback) {
  requestAnimationFrame(callback)
}

Game.play = function () {
  var $ = window.jQuery

  $('#room').touch(onFire, null)
  $('#inventory').touch(onItem, null)

  startGame(render)
}

})(window.Game = window.Game || {})
