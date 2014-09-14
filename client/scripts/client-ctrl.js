'use strict';

angular.module('clientApp.controllers')
  .controller('ClientCtrl', function ($scope) {

    $scope.infoText = 'Not connected to canvas';
    $scope.connected = false;
    $scope.user = {
      name: ''
    };
    $scope.points = {
      x: 0,
      y: 0
    };
    var drawPoints = [];
    var host = 'ws://192.168.43.23:5000/';
    var ws;

    ws = new ReconnectingWebSocket(host);

    ws.onopen = function () {
      $scope.connected = true;
      console.log('Connected');
      $scope.infoText = 'Connected to canvas!';
      ws.send(JSON.stringify({
        user: 'BRUKERNAVN'
      }));
    };

    ws.onclosed = function () {
      $scope.connected = false;
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
      $scope.points.x = coord.x;
      $scope.points.y = coord.y;
      console.log(coord);
      if ($scope.connected) {
        drawPoints.push(coord);

        if (drawPoints.length >= 10) {
          ws.send(JSON.stringify(drawPoints));
          $scope.infoText = 'Coordinates sent: ' + JSON.stringify(coord);

          drawPoints = [];
        }

      }
    });
  });
