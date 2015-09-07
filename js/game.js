var Quest = (function () {
'use strict';

var $ = window.jQuery
  , quest = {}
  , element = $('#quest')
  , marker = 0
  , text = []
  , dirty = false

text = [
  "Heal the bat with the potion."
, "Put the bow in the chest."
, "Hide the key under the rock."
, "Wash your hair in the fountain."
, "Leave the ruins via the stairs."
, "A brave hero enters a strange land&hellip;"
]

quest.reset = function () {
  marker = 0
  dirty = true
}

quest.render = function () {
  if (dirty) {
    element.html(text[marker])
    dirty = false
  }
}

quest.complete = function (name) {
  if (name === 'monster' && marker === 0) {
    marker = 1
  } else if (name === 'chest' && marker === 1) {
    marker = 2
  } else if (name === 'rock' && marker === 2) {
    marker = 3
  } else if (name === 'fountain' && marker === 3) {
    marker = 4
  } else if (name === 'stairs' && marker === 4) {
    marker = 5
  }
  dirty = true
}

quest.current = function () {
  switch (marker) {
    case 0: return 'monster'
    case 1: return 'chest'
    case 2: return 'rock'
    case 3: return 'fountain'
    case 4: return 'stairs'
    case 5: return 'restart'
    default: return null
  }
}

return quest
}())

var Score = (function () {
'use strict';

var $ = window.jQuery
  , score = {}
  , element = $('#score')
  , total = 0
  , dirty = true

score.reset = function () {
  total = 0
  dirty = true
}

score.render = function () {
  if (dirty) {
    element.html(total)
    dirty = false
  }
}

score.increment = function (amount) {
  amount = parseInt(amount, 10)
  if (isNaN(amount)) {
    amount = 1
  }
  total += amount
  dirty = true
}

return score
}())

var Emote = (function () {
'use strict';

var $ = window.jQuery
  , emote = {}
  , element = $('#emote')
  , text = ''
  , dirty = 0

emote.reset = function () {
  text = ''
  dirty = 1 | 2
}

emote.render = function () {
  if (dirty & 1) {
    element.html(text).remove('fade')
    dirty &= ~1
    return
  }
  if (dirty & 2) {
    element.add('fade')
    dirty &= ~2
    return
  }
}

emote.say = function (html) {
  text = html
  dirty = 1 | 2
}

return emote
}())

var Room = (function () {
'use strict';

var r = {}
  , $ = window.jQuery
  , rocks = [$('#rocks1')]
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

r.reset = function () {
  var i = 0
    , tile = null

  for (i = 0; i < rocks.length; i += 1) {
    tile = this.random_tile({ width: 32, height: 32 })
    rocks[i].top(tile.top)
    rocks[i].left(tile.left)
  }
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
  , ctx = null
  , images = {}
  , ic = {}

if (canvas) {
  ctx = canvas.getContext('2d')
}
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
      Room.reset()
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

var color = undefined

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
  var $ = window.jQuery
  if (Weapon.moving() || Target.moving()) {
    return
  }
  Player.fire()
  $('#button-two').add('pressed')
}

function offFire (target, e) {
  var $ = window.jQuery
  $('#button-two').remove('pressed')
}


// A pseudo random number generator based on Alexander Klimov and
// Adi Shamer's paper "A New Class of Invertible Mappings".
var PRNG = (function () {
'use strict';

var rng = {}
  , max = Math.pow(2, 32)
  , state = undefined

// Call seed with "null" to start in a random state.
rng.seed = function (value) {
  if (value !== undefined) {
    state = parseInt(value, 10)
  }
  if (isNaN(state)) {
    state = Math.floor(Math.random() * max)
  }
  return state
}

rng.random = function () {
  state += (state * state) | 5
  return (state >>> 32) / max
}

rng.randomInclusive = function (min, max) {
  return Math.floor(this.random() * (max - min + 1)) + min;
}

rng.shuffle = function (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(this.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

return rng
}())

var Ruins = (function () {
'use strict';

var ruins = {}
  , positions = {}
  , quadrants = []

ruins.reset = function () {
  positions = []
  quadrants = []
}

// Tiles can start in one of four quadrants NE, SE, SW or NW.
// Two tiles are not allowed to occupy the same quadrant.
ruins.loc = function (name) {
  var row = 0
    , col = 0
    , quad = null

  if (!positions.hasOwnProperty(name)) {
    if (quadrants.length <= 0) {
      quadrants = ['NE','SE','SW','NW']
      PRNG.shuffle(quadrants)
    }

    row = PRNG.randomInclusive(0, 1)
    col = PRNG.randomInclusive(0, 2)
    quad = quadrants.pop()
    if (quad.indexOf('E') > -1) {
      col += 6
    }
    if (quad.indexOf('S') > -1) {
      row += 4
    }

    positions[name] = { row: row, col: col }
  }

  return positions[name]
}

return ruins
}())


var Inventory = (function () {
'use strict';

var $ = window.jQuery
  , o = {}
  , picked = 'sword'
  , inventory = {}
  , usable = []
  , visible = []
  , possible = ['sword','restart','bow','hands','potion','github','key','twitter']
  , dirty = false

function showItem (item) {
  var index = visible.indexOf(item)
  if (index < 0) {
    visible.push(item)
    dirty = true
  }
}

function hideItem (item) {
  var index = visible.indexOf(item)
  if (index > -1) {
    visible.splice(index, 1)
    dirty = true
  }
}

function equipItem (item) {
  var index = usable.indexOf(item)
  if (index < 0) {
    usable.push(item)
    dirty = true
  }
}

function unequipItem (item) {
  var index = usable.indexOf(item)
  if (index > -1) {
    usable.splice(index, 1)
    dirty = true
  }
}

function isVisible (item) {
  return visible.indexOf(item) > -1
}

o.reset = function () {
  this.loadout('hero')
}

o.render = function () {
  var i = 0
    , key = ''

  if (dirty) {
    for (i = 0; i < possible.length; i += 1) {
      key = possible[i]
      if (!inventory.hasOwnProperty(key)) {
        inventory[key] = $('#'+key)
      }
      inventory[key].remove('picked')

      if (this.usable(key)) {
        inventory[key].remove('used')
      } else {
        inventory[key].add('used')
      }

      if (isVisible(key)) {
        inventory[key].remove('hidden')
      } else {
        inventory[key].add('hidden')
      }
    }
    inventory[picked].add('picked')

    dirty = false
  }
}

o.loadout = function (name) {
  if (name === 'hero') {
    picked = 'sword'
    usable = ['sword','bow','potion']
    visible = ['sword','bow','potion','key']
  } else if (name === 'restart') {
    picked = 'hands'
    usable = ['restart','github','twitter']
    visible = ['restart','hands','github','twitter']
  }
  dirty = true
}

o.pick = function (item) {
  if (picked !== item) {
    picked = item
    dirty = true
  }
}

o.equipped = function () {
  return picked
}

o.pickup = function (item) {
  equipItem(item)
  showItem(item)
  this.pick(item)
}

o.use = function (item) {
  unequipItem(item)

  if (item === 'bow') {
    hideItem('bow')
    this.pickup('hands')
  }
}

o.usable = function (item) {
  return usable.indexOf(item) > -1
}

return o
}())


var Fountain = (function () {
'use strict';

var $ = window.jQuery
  , f = {}
  , element = $('#fountain')
  , row = 0
  , col = 0
  , dirty = false

f.reset = function () {
  var loc = Ruins.loc('fountain')
  row = loc.row
  col = loc.col
  dirty = true
}

f.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

f.row = function () {
  return row
}

f.col = function () {
  return col
}

return f
}())

var Stairs = (function () {
'use strict';

var $ = window.jQuery
  , stairs = {}
  , element = $('#stairs')
  , row = 0
  , col = 0
  , dirty = false

stairs.reset = function () {
  var loc = Ruins.loc('stairs')
  row = loc.row
  col = loc.col
  dirty = true
}

stairs.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

stairs.row = function () {
  return row
}

stairs.col = function () {
  return col
}

return stairs
}())

var Rock = (function () {
'use strict';

var $ = window.jQuery
  , rock = {}
  , element = $('#rock')
  , row = 0
  , col = 0
  , dirty = false

rock.reset = function () {
  var loc = Ruins.loc('rock')
  row = loc.row
  col = loc.col
  dirty = true
}

rock.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

rock.row = function () {
  return row
}

rock.col = function () {
  return col
}

return rock
}())

var Chest = (function () {
'use strict';

var $ = window.jQuery
  , c = {}
  , element = $('#chest')
  , row = 0
  , col = 0
  , dirty = false

c.reset = function () {
  var loc = Ruins.loc('chest')
  row = loc.row
  col = loc.col
  dirty = true
}

c.render = function () {
  if (dirty) {
    element.top(row * 32)
    element.left(col * 32)
    dirty = false
  }
}

c.row = function () {
  return row
}

c.col = function () {
  return col
}

return c
}())


var Monster = (function () {
'use strict';

var $ = window.jQuery
  , m = {}
  , element = $('#monster')
  , row = 0
  , col = 0
  , alive = false
  , dirty = 0

m.reset = function () {
  row = 0
  col = 4
  alive = false
  dirty = 1 | 2
}

m.render = function () {
  if (dirty & 1) {
    element.top(row * 32)
    element.left(col * 32)
    dirty &= ~1
  }
  if (dirty & 2) {
    if (alive) {
      element.add('fast').remove('dead')
    } else {
      element.remove('fast').add('dead')
    }
    dirty &= ~2
  }
}

m.box = function () {
  return element.box()
}

m.row = function (value) {
  if (undefined !== value && row !== value) {
    row = value
    dirty |= 1
  }
  return row
}

m.col = function (value) {
  if (undefined !== value && col !== value) {
    col = value
    dirty |= 1
  }
  return col
}

m.heal = function () {
  if (!alive) {
    alive = true
    dirty |= 2
  }
}

m.dead = function () {
  return !alive
}

return m
}())

var Hero = (function () {
'use strict';

var $ = window.jQuery
  , h = {}
  , element = $('#hero')
  , row = 0
  , col = 0
  , dirty = false

h.reset = function () {
  row = 1
  col = 4
  dirty = true
}

h.render = function () {
  if (dirty) {
    element.top((row * 32) - 4)
    element.left(col * 32)
    dirty = false
  }
}

h.box = function () {
  return element.box()
}

h.row = function () {
  return row
}

h.col = function () {
  return col
}

h.move = function (direction) {
  if (direction === 'forward') {
    row -= 1
    dirty = true
  }
  else if (direction === 'backward') {
    row += 1
    dirty = true
  }
  else if (direction === 'left') {
    col -= 1
    dirty = true
  }
  else if (direction === 'right') {
    col += 1
    dirty = true
  }
  if (row < 1) {
    row = 1
  }
  else if (row > 6) {
    row = 6
  }
  if (col < 0) {
    col = 0
  }
  else if (col > 8) {
    col = 8
  }
}

return h
}())


function onUse (target, e) {
  var item = null
    , hbox = null
    , mbox = null
    , hx = 0
    , mx = 0
    , dx = 0
    , quest = null

  item = Inventory.equipped()
  if (!Inventory.usable(item)) {
    return
  }

  hbox = Hero.box()
  mbox = Monster.box()
  hx = hbox.left + (hbox.width / 2)
  mx = mbox.left + (mbox.width / 2)
  dx = Math.abs(hx - mx)

  quest = Quest.current()

  if (item === 'sword') {
    if (quest === 'monster' && Monster.dead() && Hero.col() === Monster.col() && Hero.row() - Monster.row() === 1) {
      Emote.say("You don't look good.")
    } else if (dx < 24) {
      Hero.move('forward')
    } else if (hx < mx) {
      Hero.move('left')
      Monster.col(Hero.col())
    } else {
      Hero.move('right')
      Monster.col(Hero.col())
    }
    Score.increment()
  }

  if (item === 'bow') {
    if (quest === 'chest' && Hero.col() === Chest.col() && Hero.row() - Chest.row() === 1) {
      Inventory.pickup('key')
      Inventory.use('bow')
      Quest.complete('chest')
    } else if (dx < 24) {
      Hero.move('backward')
    } else if (hx < mx) {
      Hero.move('right')
      Monster.col(Hero.col())
    } else {
      Hero.move('left')
      Monster.col(Hero.col())
    }
    Score.increment()
  }

  if (item === 'hands') {
    if (quest  === 'fountain' && Hero.col() === Fountain.col() && Hero.row() - Fountain.row() === 1) {
      Quest.complete('fountain')
    } else if (quest  === 'stairs' && Hero.col() === Stairs.col() && Hero.row() - Stairs.row() === 1) {
      Quest.complete('stairs')
      Inventory.loadout('restart')
    } else if (dx < 24) {
      Hero.move('backward')
    } else if (hx < mx) {
      Hero.move('right')
      Monster.col(Hero.col())
    } else {
      Hero.move('left')
      Monster.col(Hero.col())
    }
    Score.increment()
  }

  if (item === 'potion') {
    if (quest === 'monster' && Monster.dead() && Hero.col() === Monster.col() && Hero.row() - Monster.row() === 1) {
      Inventory.use('potion')
      Monster.heal()
      Quest.complete('monster')
      Emote.say("You should drink this.")
    } else {
      Emote.say("I need to get closer.")
    }
  }

  if (item === 'key') {
    if (quest === 'rock' && Hero.col() === Rock.col() && Hero.row() - Rock.row() === 1) {
      Inventory.use('key')
      Quest.complete('rock')
    }
  }

  if (item === 'restart') {
    newColor()
    window.location.hash = color
  }
}

function onItem (target, e) {
  var item = target.unwrap().id
  if (Inventory.equipped() !== item) {
    Inventory.pick(item)
  } else {
    onUse()
  }
}

function render () {
  requestAnimationFrame(render)

  Quest.render()
  Score.render()
  Inventory.render()
  Stairs.render()
  Fountain.render()
  Rock.render()
  Chest.render()
  Monster.render()
  Hero.render()
  Emote.render()
}

// Pick a random color out of the RGB color space.
// Don't use the PRNG, since it will be seeded with the color.
function newColor () {
  var hash = color
  do {
    hash = Math.floor(Math.random() * 16777216)
    hash = ('000000' + hash.toString(16)).substr(-6)
  } while (hash === color)
  color = hash
}

function resetGame () {
  Ruins.reset()
  Quest.reset()
  Score.reset()
  Inventory.reset()
  Stairs.reset()
  Fountain.reset()
  Rock.reset()
  Chest.reset()
  Monster.reset()
  Hero.reset()
  Emote.reset()
}

function onHashChange () {
  var hash = window.location.hash.substring(1)
  if (/^[0-9A-F]{6}$/i.test(hash)) {
    color = hash
    PRNG.seed(parseInt(color, 16))
  }
  resetGame()
}

function startGame (callback) {
  var hash = window.location.hash.substring(1)
    , reloaded = false

  if (/^[0-9A-F]{6}$/i.test(hash)) {
    if (color === hash) {
      // Continuing a saved game...
      reloaded = true
    } else {
      // Replaying a linked game...
      color = hash
      PRNG.seed(parseInt(color, 16))
    }
  } else {
    // Playing a new game...
    newColor()
    PRNG.seed(parseInt(color, 16))
  }

  if (window.location.hash.substring(1) !== color) {
    window.location.hash = color
  } else if (!reloaded) {
    resetGame()
  }

  requestAnimationFrame(callback)
}

Game.play = function () {
  var $ = window.jQuery
    , html = ''
    , items = ['sword','restart','bow','hands','potion','github','key','twitter']
    , name = ''
    , i = 0

  for (i = 0; i < items.length; i += 1) {
    html += '<li id="klass" class="item klass">klass</li>'.replace(/klass/g, items[i])
  }

  $('#items').html(html)

  for (i = 0; i < items.length; i += 1) {
    $('#'+items[i]).touch(onItem)
  }

  $('#room').touch(onUse)
  $(window).on('hashchange', onHashChange)

  startGame(render)
}

})(window.Game = window.Game || {})

Game.play()
