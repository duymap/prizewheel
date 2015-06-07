'use strict';

angular.module('prizewheel')
  .factory('uid', ['$cookies', function($cookies) {
    var isUndefined = angular.isUndefined,
        uid_service = {
          create: function() {
            var ngUuid = $cookies.ngUuid;
            if (isUndefined(ngUuid)) {
              $cookies.ngUuid = guid();
            }
          },
          get: function() {
            var ngUuid = $cookies.ngUuid;
            if (isUndefined(ngUuid)) {
              ngUuid = guid();
              $cookies.ngUuid = ngUuid;
            }
            return ngUuid;
          }
        };

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    return uid_service;
  }]);
