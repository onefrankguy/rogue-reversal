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

Game.play = function () {
  var $ = window.jQuery
  $('#player').add(gender)
  $('#player').touch(onPlayer, null)
}


})(window.Game = window.Game || {})
