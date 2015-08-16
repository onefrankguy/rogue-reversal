var ImageCache = (function () {
'use strict';

var $ = window.jQuery
  , canvas = $('#gfx').unwrap()
  , ctx = canvas.getContext('2d')
  , images = {}
  , ic = {}

images['boy'] = {"width":40,"height":40,"data":"137a8b30a1c3d2c3d2b28a1c1d1c2d1c3d1c2d1b27a1d1c3d1c6d1b26a1b6d1c1d1c3d1b26a1b4d1c1d1c1d1b1d1b2d26a2d1c1d1c1b1d2b2e1b1c1d26a1d1b2d1b5e2f1b1d26a1d1b1d2g1h3f1h2g1b1i1j25a1j1b1g1k2h3f2h1k1g1i1j26a1b1g1k1l1h3f1h1l1k1g1j28a1j1k1l1h3f1h1l1k1j29a1j1i8e1i30a1j1i1e3m1e1i1j30a2n1j5i1j2n28a2n1o1n5j1n2o1n27a1n3o5n1p2o1n27a1n3o6p2o1n27a1n1o1n1o2p2q2p1n1o1n27a1n1o1n1o1p2q3p1n1o1n27a1n1o1n1o1p2q2p1q1n1o1n26a2n1o1n2o1p1q2p1q1n1o1n1j25a1j1r2n3o3p1q2n1r1j25a1j1r1f1n6o1q1n1f1r1j25a1j1r1f1s7n1s2j27a2j1s7t1s31a1s2t1u4t1s31a1s1t1u1s1a1s1u1t1s31a1s1t1u1s1a1s1u1t1s31a1s1t1u1s1a1s1u1t1s31a1s1t1u1s1a1s1u2s31a1v2t1v1a1s1u2s30a2v2s1v1a2v1s2v29a5v1a5v134a","values":{"a":"#00000000","b":"#70282aff","c":"#7a2b2eff","d":"#73272aff","e":"#f9e2b6ff","f":"#f9ceacff","g":"#3c1915ff","h":"#291503ff","i":"#d4a477ff","j":"#bb8d63ff","k":"#cbd1d7ff","l":"#6c3005ff","m":"#cea083ff","n":"#615f5cff","o":"#767472ff","p":"#8f8a85ff","q":"#a19c94ff","r":"#e0ae81ff","s":"#36335dff","t":"#47446dff","u":"#515077ff","v":"#d0d0cfff"}}
images['girl'] = {"width":40,"height":40,"data":"96a5b34a2b4c4b29a2b7d1e1d1b28a1b4d2e2d2e2b26a1b2d5e1d2c1e1c1b26a1b1d4e2d1b2c1e1d2b24a2b3e3d2b2f1b1e1d1b24a1b1c4d2b4f2b1d1b24a1b1c1d3b5f2g3b24a1b1e2b2h1i3g1i2h1g2b24a1b1e1b1h1j2i3g2i1j1h2b24a2b1d1h1j1k1i3g1i1k1j1h2b23a3b1c1l1j1k1i3g1i1k1j1l2b23a1b1a2b1d1m8f4b24a2b2d1m1f3n1f1m1l2b1c1b24a2b2o1b5m1l2o1b1c1b23a2b2o1p1o5l1o2p1o2b23a2b1o3p5o1q2p1o3b22a2b1o3p6q2p1o1c24a2b1o1p1o1p2q2r2q1o1p1o27a1o1p1o1p1q2r3q1o1p1o27a1o1p1o1p1q2r2q1r1o1p1o26a2o1p1o2p1q1r2q1r1o1p1o1l25a1l1s2o3p3q1r2o1s1l25a1l1s1g1o6p1r1o1g1s1l25a1l1s1g1t7o1t2l27a2l1t7u1t31a1t2u1v4u1t31a1t1u1v1t1a1t1v1u1t31a1t1u1v1t1a1t1v1u1t31a1t1u1v1t1a1t1v1u1t31a1t1u1v1t1a1t1v2t31a1w2u1w1a1t1v2t30a2w2t1w1a2w1t2w29a5w1a5w134a","values":{"a":"#00000000","b":"#6a1f1aff","c":"#82362fff","d":"#8a3629ff","e":"#924a42ff","f":"#f9e2b6ff","g":"#f9ceacff","h":"#3c1915ff","i":"#291503ff","j":"#cbd1d7ff","k":"#6c3005ff","l":"#bb8d63ff","m":"#d4a477ff","n":"#cea083ff","o":"#615f5cff","p":"#767472ff","q":"#8f8a85ff","r":"#a19c94ff","s":"#e0ae81ff","t":"#36335dff","u":"#47446dff","v":"#515077ff","w":"#d0d0cfff"}}

/* boy */
/* a = background */
/* b = hair outline */
/* c = hair hilight 1 */
/* d = hair major */
/* e = mouth */
/* f = nose */
/* g = eyebrows */
/* h = pupils */
/* i = chin */
/* j = outline */
/* k = eye whites */
/* l = iris */
/* m = teeth */
/* n = shirt outline */
/* o = shirt base */
/* p = shirt hilight 1 */
/* q = shirt hilight 2 */
/* r = hands  */
/* s = pants outline */
/* t = pants base */
/* u = pants hilight */
/* v = shoes */

/* girl */
/* a = background */
/* b = hair outline */
/* c = hair hilight 1 */
/* d = hair hilight 2 */
/* e = hair hilight 3 */
/* f = mouth */
/* g = nose */
/* h = eyebrows */
/* i = pupils */
/* j = eye whites */
/* k = iris */
/* l = outline */
/* m = chin */
/* n = teeth */
/* o = shirt outline */
/* p = shirt base */
/* q = shirt hilight 1 */
/* r = shirt hilight 2 */
/* s = hands */
/* t = pants outline */
/* u = pants base */
/* v = pants hilight */
/* w = shoes */

function hexToRgba (hex) {
  var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[4], 16),
  } : null
}

ic.getDataURL = function (name) {
  var clothes = ''
    , color = ''

  name = name.split('-')
  switch (name.length) {
    case 1:
      name = name[0]
      break
    case 2:
      clothes = name[1]
      name = name[0]
      break
    case 3:
      color = name[2]
      clothes = name[1]
      name = name[0]
      break
  }

  switch (clothes) {
    case 'shirt':
      if (name === 'boy') {
        images[name].values.n = color
        images[name].values.o = color
        images[name].values.p = color
        images[name].values.q = color
      } else {
        images[name].values.o = color
        images[name].values.p = color
        images[name].values.q = color
        images[name].values.r = color
      }
      break
    case 'pants':
      if (name === 'boy') {
        images[name].values.s = color
        images[name].values.t = color
        images[name].values.u = color
      } else {
        images[name].values.t = color
        images[name].values.u = color
        images[name].values.v = color
      }
      break
    case 'shoes':
      if (name === 'boy') {
        images[name].values.v = color
      } else {
        images[name].values.w = color
      }
      break
  }

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
  images[name].url = canvas.toDataURL()

  return images[name].url
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

var colors = {
  'color1':  '#ff0000ff',
  'color2':  '#ff6600ff',
  'color3':  '#ff9500ff',
  'color4':  '#ffC800ff',
  'color5':  '#ffff00ff',
  'color6':  '#8bc700ff',
  'color7':  '#0ead00ff',
  'color8':  '#00a5c2ff',
  'color9':  '#005fb3ff',
  'color10': '#0011adff',
  'color11': '#6200a3ff',
  'color12': '#c7007eff'
}
var clothing = -1
function onColor (target) {
  var $ = window.jQuery
    , color = colors[target.unwrap().id]

  clothing += 1
  clothing %= 3

  switch (clothing) {
    case 0:
      $('#player').unwrap().src = ImageCache.getDataURL(gender+'-shirt-'+color)
      break
    case 1:
      $('#player').unwrap().src = ImageCache.getDataURL(gender+'-pants-'+color)
      break
    case 2:
      $('#player').unwrap().src = ImageCache.getDataURL(gender+'-shoes-'+color)
      break
  }
}

Game.play = function () {
  var $ = window.jQuery
    , html = ''
    , name = ''
    , i = 0

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
    html += '<p class="label">'
    html += '<span>'+name+'</span>'
    html += '</p>'
    html += '<div id="mannequin'+i+'1" class="mannequin">'
    html += '<img src="/img/lamp.png" class="pixelated lamp" />'
    html += '<img src="/img/mannequin.png" class="pixelated figure" />'
    html += '</div>'
    html += '<div id="mannequin'+i+'2" class="mannequin">'
    html += '<img src="/img/lamp.png" class="pixelated lamp" />'
    html += '<img src="/img/mannequin.png" class="pixelated figure" />'
    html += '</div>'
    html += '<div id="mannequin'+i+'3" class="mannequin">'
    html += '<img src="/img/lamp.png" class="pixelated lamp" />'
    html += '<img src="/img/mannequin.png" class="pixelated figure" />'
    html += '</div>'
    html += '<div id="mannequin'+i+'4" class="mannequin">'
    html += '<img src="/img/lamp.png" class="pixelated lamp" />'
    html += '<img src="/img/mannequin.png" class="pixelated figure" />'
    html += '</div>'
    $('#f'+i).html(html)
  }

  /*
  $('#player').unwrap().src = ImageCache.getDataURL(gender)
  $('#player').touch(onPlayer, null)

  for (i = 1; i <= 12; i += 1) {
    $('#color'+i).touch(onColor, null)
  }
  */
}


})(window.Game = window.Game || {})
