(function () {
  'use strict';

  //var uniqUsers = [];
  var viewPort = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
  };
  var canvas = $('canvas')[0];
  canvas.height = viewPort.height;
  canvas.width = viewPort.width;
  var context = canvas.getContext('2d');

  function drawPixel(x, y, r, g, b, a) {
    console.log('drawing');
    context.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    context.fillRect(x, y, 10, 10);
    setTimeout(function () {
      context.clearRect(x, y, 10, 10);
    }, 1000);
  }

  var ws = new ReconnectingWebSocket('ws://localhost:5001/');
  ws.onopen = function () {
    console.log('connected to WebSocket');
  };

  ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    //var userName = data.user;

    data.forEach(function (e) {
      drawPixel(e.x, e.y, 255, 0, 255, 1);
    });
  };
})();
