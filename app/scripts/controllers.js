'use strict';

var defaultWheels = ["slots/slot.0@2x.png", 
              "slots/slot.1@2x.png", 
              "slots/slot.2@2x.png", 
              "slots/slot.3@2x.png", 
              "slots/slot.4@2x.png", 
              "slots/slot.5@2x.png", 
              "slots/slot.6@2x.png", 
              "slots/slot.7@2x.png"];

var voidWheels = ["headers/void.0@2x.png", 
              "headers/void.1@2x.png", 
              "headers/void.2@2x.png", 
              "headers/void.3@2x.png", 
              "headers/void.4@2x.png", 
              "headers/void.5@2x.png", 
              "headers/void.6@2x.png", 
              "headers/void.7@2x.png"];

var prizeIDs = [0, 0, 0, 0, 0, 0, 0, 0];

angular.module('prizewheel.controllers', [])

.controller('MainCtrl', function($scope, $rootScope, Wheels, uid, $state, ApiConnection, $timeout, $interval, $ionicPopup) {
  
  $scope.wheelselect = "Current selected: none";
  $scope.countDownMs = 0;
  $scope.unlocked = false;

  var stop;
  $scope.stopCountDown = function() {
    $scope.unlocked = false;
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
      $scope.countDownMs = 0;
    }
  };

  $scope.startCountDown = function() {
    $scope.unlocked = true;
    stop = $interval(function() {
      $scope.countDownMs -= 1000;
      if ($scope.countDownMs < 0) {
        $scope.stopCountDown();
      }
    }, 1000);
  };

  ApiConnection.get('user_check.php?uid='+uid.get()).
    success(function(resp, status, headers, config) {
      if(resp.success) {
        if (resp.data > 0) {
          $scope.countDownMs = resp.data * 60 * 1000;
          $scope.startCountDown();
        } else if (resp.data.expire != null && parseInt(resp.data.expire) * 1000 > Date.now()) {
          $scope.countDownMs = parseInt(resp.data.expire) * 1000 - Date.now();
          $scope.startCountDown();
        }
      }
    });
  
  $scope.$on('wheelChanged', function(){
    //console.log ($rootScope.wheelselected);
    $state.go('input');
    
  });

  $scope.navOffer = function() {
      $state.go('offer');
  };
  Wheels.drawing()
    .success(function(data, status, headers, config) {
      var returnData = data.split("\n");
      var wheelData = [];
      for (var i = 0, len = 8; i < len; i++) {
        if(returnData[i].split(",")[1] != "0") {
          wheelData[i] = defaultWheels[i];
          prizeIDs[i] = returnData[i].split(",")[1];
        } else {
          wheelData[i] = voidWheels[i];
        }
      }
      $scope.wheelsIds = prizeIDs;
      return $scope.wheelsList = wheelData;
    }).error(function(data, status, headers, config) {
      return $scope.wheelsList = defaultWheels;
    });
})

.controller('InputCtrl', function($scope, $rootScope, $http, $state, uid, $cookies) {
  
  $scope.formSubmitting = false;
  $scope.formSubmitted = false;
  return angular.extend($scope, {
    form: {
      name: '',
      email: '',
      mobile: '',
      agreed: 0,
      promos: 0,
      age: 30
    },
    register: function(formValid) {
      var data, fNameEl, field, nameArr, url, _results;
      $scope.formSubmitting = true;
      
      if (formValid) {
        var submitData = {
          'udid': uid.get(),
          'prizeID' : $rootScope.wheelselected,
          'name': $scope.form.name,
          'email': $scope.form.email,
          'mobile': $scope.form.mobile,
          'agreed': $scope.form.agreed?1:0,
          'promos': $scope.form.promos?1:0,
          'age': $scope.form.age
        };
        
        
        jQuery.post( "http://prizewheel.grandprizenetwork.com/api/insertEntry.php", submitData)
          .done(function( data ) {
            console.log (data);
            //$state.go('main');
          })
          .fail(function() {
            //alert( "error" );
          });
          
        $scope.submitData = submitData;
        return angular.extend($scope.form, url = 'https://grandprizenetwork.com/insertEntry.php', data = submitData 
        , jQuery.post( url, data)
          .done(function( data ) {
            //console.log (data);
            $state.go('main');
          })
          .fail(function() {
            //alert( "error" );
          })
        );
      } else {
        $scope.formSubmitting = false;
        return;
      }
    }
  });
})

.controller('OfferCtrl', function($scope, uid, $state, $sce) {
  $scope.offerWallSrc = $sce.trustAsResourceUrl("http://iframe.sponsorpay.com/mbrowser?device=phone&appid=30667&uid=" + uid.get());
});
