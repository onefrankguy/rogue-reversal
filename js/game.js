;(function (Game) {
'use strict';

var gender = 'boy'
if (Math.floor(Math.random() * 2) === 0) {
  gender = 'girl'
}

function onPlayer (target) {
  target.remove(gender)
  if (gender === 'boy') {
    gender = 'girl'
  } else {
    gender = 'boy'
  }
  target.add(gender)
}

function hexToRgba (hex) {
  var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[4], 16),
  } : null
}

Game.play = function () {
  var $ = window.jQuery
    , data = {"width":40,"height":40,"data":"96a5b34a2b4c4b29a2b7d1e1d1b28a1b4d2e2d2e2b26a1b2d5e1d2c1e1c1b26a1b1d4e2d1b2c1e1d2b24a2b3e3d2b2f1b1e1d1b24a1b1c4d2b4f2b1d1b24a1b1c1d3b5f2g3b24a1b1e2b2h1i3g1i2h1g2b24a1b1e1b1h1j2i3g2i1j1h2b24a2b1d1h1j1k1i3g1i1k1j1h2b23a3b1c1l1j1k1i3g1i1k1j1l2b23a1b1a2b1d1m8f4b24a2b2d1m1f3n1f1m1l2b1c1b24a2b2o1b5m1l2o1b1c1b23a2b2o1p1o5l1o2p1o2b23a2b1o3p5o1q2p1o3b22a2b1o3p6q2p1o1c24a2b1o1p1o1p2q2r2q1o1p1o27a1o1p1o1p1q2r3q1o1p1o27a1o1p1o1p1q2r2q1r1o1p1o26a2o1p1o2p1q1r2q1r1o1p1o1l25a1l1s2o3p3q1r2o1s1l25a1l1s1g1o6p1r1o1g1s1l25a1l1s1g1t7o1t2l27a2l1t7u1t31a1t2u1v4u1t31a1t1u1v1t1a1t1v1u1t31a1t1u1v1t1a1t1v1u1t31a1t1u1v1t1a1t1v1u1t31a1t1u1v1t1a1t1v2t31a1w2u1w1a1t1v2t30a2w2t1w1a2w1t2w29a5w1a5w","values":{"a":"#00000000","b":"#6a1f1aff","c":"#82362fff","d":"#8a3629ff","e":"#924a42ff","f":"#f9e2b6ff","g":"#f9ceacff","h":"#3c1915ff","i":"#291503ff","j":"#cbd1d7ff","k":"#6c3005ff","l":"#bb8d63ff","m":"#d4a477ff","n":"#cea083ff","o":"#615f5cff","p":"#767472ff","q":"#8f8a85ff","r":"#a19c94ff","s":"#e0ae81ff","t":"#36335dff","u":"#47446dff","v":"#515077ff","w":"#d0d0cfff"}}
    , ctx = $('#gfx').unwrap().getContext('2d')
    , image = ctx.createImageData(data.width, data.height)
    , i = 0
    , j = 0
    , x = 0
    , y = 0
    , offset = 0
    , color = null
    , value = ''
    , number = ''

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

  $('#player').touch(onPlayer, null)
}


})(window.Game = window.Game || {})
