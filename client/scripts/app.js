(function () {
  'use strict';

  var gyroX = $('#gyroX');
  var gyroY = $('#gyroY');
  var gyroZ = $('#gyroZ');
  var melding = [];
  var host = 'ws://192.168.43.23:5000/';
  var ws;
  gyroX.text('0');
  gyroY.text('Sendt:');

  ws = new ReconnectingWebSocket(host);

  ws.onopen = function () {
    console.log('Connected');
    ws.send(JSON.stringify({
      user: 'BRUKERNAVN'
    }));
  };

  ws.onclosed = function () {
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
    var coord = pointerEventToXY(e);
    melding.push(coord);

    if (melding.length >= 10) {
      ws.send(JSON.stringify(melding));
      gyroZ.text('Sendt: ' + JSON.stringify(coord));

      melding = [];
    }
    console.log(coord);

    gyroX.text(coord.x);
    gyroY.text(coord.y);
  });
})();
