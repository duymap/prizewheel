'use strict';

angular.module('prizewheel')
  .factory('Wheels', function(ApiConnection) {
    var Wheels;
    
    return Wheels = (function() {
      function Wheels() {}
      
      Wheels.drawing = function() {
        return ApiConnection.get('drawingWebApp.txt');
      };
      
      Wheels.bonusDrawing = function() {
        return ApiConnection.get('bonusdrawing2.txt');
      };
      
      Wheels.fromArray = function(apiArray) {
      var apiItem, result, _i, _len;
      result = [];
      for (_i = 0, _len = apiArray.length; _i < _len; _i++) {
        apiItem = apiArray[_i];
        result.push(new Wheels(apiItem));
      }
      return result;
    };

    function Wheels(apiData) {
      var key;
      this.apiData = apiData;
      for (key in apiData) {
        this[key] = apiData[key];
      }
    }
    
    return Wheels;

  })();
});