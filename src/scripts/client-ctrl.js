'use strict';

angular.module('clientApp.controllers')
  .controller('ClientCtrl', function ($scope) {

    $scope.infoText = 'Not connected to canvas';
    $scope.connected = false;
    $scope.user = {
      name: ''
    };
    $scope.serverUser = {
      userId: '',
      color: ''
    };
    $scope.points = {
      x: 0,
      y: 0
    };
    var drawPoints = [];
    var host = 'ws://picasso-point-server.herokuapp.com:5001';
    var ws;

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

    $scope.createUser = function () {
      console.log(ws);
      ws = new ReconnectingWebSocket(host);
      console.log(ws);
      ws.onopen = function () {
        console.log('Connected');
        if (!$scope.connected) {
          console.log('Sending username');
          ws.send(JSON.stringify({
            user: $scope.user.name
          }));
        }
        $scope.infoText = 'Connected to canvas!';
      };

      ws.onclosed = function () {
        $scope.connected = false;
        $scope.serverUser.user = '';
        $scope.serverUser.color = '';
        console.log('Disconnected');
      };

      ws.onmessage = function (msg) {
        var data = JSON.parse(msg.data);
        if (data.user && data.color) {
          console.log('Recieved username and color');
          $scope.connected = true;
          $scope.serverUser.userId = data.user;
          $scope.serverUser.color = data.color;
        }
      };
    };

    $('body').on('mousedown mousemove touchstart touchmove touchend', function (e) {
      var coord = pointerEventToXY(e);
      $scope.points.x = coord.x;
      $scope.points.y = coord.y;
      console.log(coord);
      if ($scope.connected && $scope.serverUser.userId && $scope.serverUser.color) {
        drawPoints.push(coord);

        if (drawPoints.length >= 10) {
          ws.send(JSON.stringify({
            userId: $scope.serverUser.userId,
            color: $scope.serverUser.color,
            points: drawPoints
          }));
          $scope.infoText = 'Coordinates sent: ' + JSON.stringify(coord);

          drawPoints = [];
        }

      }
    });
  });
