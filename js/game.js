;(function (Game) {
'use strict';

Game.play = function () {
  var $ = window.jQuery
    , color = 1

  function cycle () {
    $('#player').remove('color'+color)
    color += 1
    if (color > 12) {
      color = 1
    }
    $('#player').add('color'+color)
    window.setTimeout(cycle, 2000)
  }
  cycle()
}


})(window.Game = window.Game || {})
