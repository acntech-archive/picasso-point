(function () {
  'use strict';

  var gyroX = $('#gyroX');
  var gyroY = $('#gyroY');
  var gyroZ = $('#gyroZ');
  var drawPoints = [];
  var host = 'ws://192.168.43.23:5000/';
  var ws;
  var connected = false;
  gyroX.text('0');
  gyroY.text('0');
  gyroZ.text('Not connected to WebSocket..');

  ws = new ReconnectingWebSocket(host);

  ws.onopen = function () {
    connected = true;
    console.log('Connected');
    gyroZ.text('Connected to WebSocket! :D');
    ws.send(JSON.stringify({
      user: 'BRUKERNAVN'
    }));
  };

  ws.onclosed = function () {
    connected = false;
    console.log('Disconnected');
  };

  function pointerEventToXY(e) {
    var out = {
      x: 0,
      y: 0
    };
    if (e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend' || e.type === 'touchcancel') {
      var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      out.x = touch.pageX;
      out.y = touch.pageY;
    } else if (e.type === 'mousedown' || e.type === 'mouseup' || e.type === 'mousemove' || e.type === 'mouseover' || e.type === 'mouseout' || e.type === 'mouseenter' || e.type === 'mouseleave') {
      out.x = e.pageX;
      out.y = e.pageY;
    }

    out.x = parseInt(out.x, 10);
    out.y = parseInt(out.y, 10);
    return out;
  }

  $('body').on('mousedown mousemove touchstart touchmove touchend', function (e) {
    if (connected) {
      var coord = pointerEventToXY(e);
      drawPoints.push(coord);

      if (drawPoints.length >= 10) {
        ws.send(JSON.stringify(drawPoints));
        gyroZ.text('Coordinates sent: ' + JSON.stringify(coord));

        drawPoints = [];
      }
      console.log(coord);

      gyroX.text(coord.x);
      gyroY.text(coord.y);
    }
  });
})();
