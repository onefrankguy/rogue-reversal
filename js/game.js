var ColorWheel = (function () {
'use strict';

var hues = {}
  , tints = {}
  , tones = {}
  , shades = {}
  , cw = {}

/* Hues are pure color. */
hues = {
    'yellow':        '#fff400ff'
  , 'yellow-orange': '#ffd300ff'
  , 'orange':        '#fda500ff'
  , 'red-orange':    '#f58351ff'
  , 'red':           '#ed2324ff'
  , 'red-violet':    '#8b288fff'
  , 'violet':        '#5a2e91ff'
  , 'blue-violet':   '#3e3997ff'
  , 'blue':          '#0450a5ff'
  , 'blue-green':    '#00ab85ff'
  , 'green':         '#14a049ff'
  , 'yellow-green':  '#90c841ff'
}

/* Tints are hue plus white. */
tints = {
    'yellow':        '#fff75cff'
  , 'yellow-orange': '#ffe047ff'
  , 'orange':        '#ffb833ff'
  , 'red-orange':    '#f79e78ff'
  , 'red':           '#f2674aff'
  , 'red-violet':    '#9f5da6ff'
  , 'violet':        '#7756a5ff'
  , 'blue-violet':   '#645dabff'
  , 'blue':          '#6379bcff'
  , 'blue-green':    '#3fba9bff'
  , 'green':         '#16b653ff'
  , 'yellow-green':  '#a2d161ff'
}

/* Tones are hue plus gray. */
tones = {
    'yellow':        '#f2e70dff'
  , 'yellow-orange': '#f2cc0dff'
  , 'orange':        '#f2a20dff'
  , 'red-orange':    '#dc6938ff'
  , 'red':           '#bb191aff'
  , 'red-violet':    '#791a7eff'
  , 'violet':        '#4f237fff'
  , 'blue-violet':   '#2f2978ff'
  , 'blue':          '#013f85ff'
  , 'blue-green':    '#008b6bff'
  , 'green':         '#248f4dff'
  , 'yellow-green':  '#8db654ff'
}

/* Shades are hue plus black. */
shades = {
    'yellow':        '#b8ae00ff'
  , 'yellow-orange': '#b89900ff'
  , 'orange':        '#b87700ff'
  , 'red-orange':    '#c1420bff'
  , 'red':           '#aa0e0eff'
  , 'red-violet':    '#000000ff'
  , 'violet':        '#000000ff'
  , 'blue-violet':   '#000000ff'
  , 'blue':          '#000000ff'
  , 'blue-green':    '#000000ff'
  , 'green':         '#0b5b2aff'
  , 'yellow-green':  '#648e29ff'
}

cw.hue = function (color) {
  if (hues.hasOwnProperty(color)) {
    return hues[color]
  }
  return '#ff00ffff'
}

cw.tint = function (color) {
  if (tints.hasOwnProperty(color)) {
    return tints[color]
  }
  return '#ff00ffff'
}

cw.tone = function (color) {
  if (tones.hasOwnProperty(color)) {
    return tones[color]
  }
  return '#ff00ffff'
}

cw.shade = function (color) {
  if (shades.hasOwnProperty(color)) {
    return shades[color]
  }
  return '#ff00ffff'
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

;(function (Game) {
'use strict';

var gender = 'boy'
if (Math.floor(Math.random() * 2) === 0) {
  gender = 'girl'
}

function onPlayer (target) {
  if (gender === 'boy') {
    gender = 'girl'
  } else {
    gender = 'boy'
  }
  target.unwrap().src = ImageCache.getDataURL(gender)
}

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
  mannequin.unwrap().src = ImageCache.getDataURL('mannequin', {'shirt': color})
}

Game.play = function () {
  var $ = window.jQuery
    , mannequin = ImageCache.getDataURL('mannequin')
    , html = ''
    , name = ''
    , i = 0
    , j = 0

  for (i = 1; i <= 3; i += 1) {
    switch (i) {
      case 1:
        name = 'Shirts'
        break
      case 2:
        name = 'Pants'
        break;
      case 3:
        name = 'Shoes'
        break
    }
    html = ''
    html += '<p class="pixelated label">'
    html += '<span>'+name+'</span>'
    html += '</p>'
    for (j = 1; j <= 4; j += 1) {
      html += '<div id="mannequin'+i+j+'" class="mannequin">'
      html += '<img src="./img/lamp.png" class="pixelated lamp" />'
      html += '<img id="mannequin'+i+j+'-img" class="pixelated figure" />'
      html += '</div>'
    }
    $('#f'+i).html(html)

    for (j = 1; j <= 4; j += 1) {
      $('#mannequin'+i+j).touch(onMannequin, offMannequin)
      $('#mannequin'+i+j+'-img').unwrap().src = mannequin
    }
  }

  $('#picker').touch(onPicker, offPicker)

  $('#yellow').touch(onColor, null)
  $('#yellow-orange').touch(onColor, null)
  $('#orange').touch(onColor, null)
  $('#red-orange').touch(onColor, null)
  $('#red').touch(onColor, null)
  $('#red-violet').touch(onColor, null)
  $('#violet').touch(onColor, null)
  $('#blue-violet').touch(onColor, null)
  $('#blue').touch(onColor, null)
  $('#blue-green').touch(onColor, null)
  $('#green').touch(onColor, null)
  $('#yellow-green').touch(onColor, null)
}


})(window.Game = window.Game || {})
