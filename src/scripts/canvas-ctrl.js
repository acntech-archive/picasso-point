'use strict';

angular.module('clientApp.controllers').controller('CanvasCtrl', function ($scope) {
  //var uniqUsers = [];
  var viewPort = {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth - 200
  };
  var canvas = $('canvas')[0];
  var context = canvas.getContext('2d');

  var connected = false;

  $scope.drawers = {};

  canvas.height = viewPort.height;
  canvas.width = viewPort.width;

  function drawPixel(x, y, color) {
    console.log('drawing');
    context.fillStyle = color;
    context.fillRect(x, y, 10, 10);
    setTimeout(function () {
      context.clearRect(x, y, 10, 10);
    }, 1000);
  }

  var ws = new ReconnectingWebSocket('ws://picasso-point-server.herokuapp.com:5001/', 'canvas');
  ws.onopen = function () {
    connected = true;
    console.log('connected to WebSocket');
  };

  ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    var userName = data.userId;

    if (userName) {
      $scope.drawers[userName] = data.color;
      $scope.$apply();

      data.points.forEach(function (e) {
        drawPixel(e.x, e.y, data.color);
      });
    }
  };
});
