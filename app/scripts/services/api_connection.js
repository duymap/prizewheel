'use strict';

angular.module('prizewheel')
  .factory('ApiConnection', function($http) {
    var ApiConnection;
    return ApiConnection = (function() {
      function ApiConnection() {}
  
      ApiConnection.baseUrl = 'http://prizewheel.grandprizenetwork.com/api';
  
      ApiConnection.get = function(endpoint) {
        return $http.get(this.baseUrl + "/" + endpoint);
      };
  
      return ApiConnection;
  })();
});
