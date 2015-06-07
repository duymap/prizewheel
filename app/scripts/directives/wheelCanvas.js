angular.module('prizewheel.directives', [])
  .directive('wheelCanvas', function ($rootScope, $timeout) {
    "use strict";
    return {
      restrict : 'EAC',
      replace : true,
      scope :{
        wheelsList: '=wheelsList',
        wheelsIds: '=wheelsIds',
        wheelselected: '=wheelselected',
        wheelIsSelected: '=wheelIdSelected'
      },
      template: "<canvas width='614' height='634''></canvas>",
      link: function (scope, element, attribute) {
        var locked = false;
        var PADDING_TOP = 20;
        
        // globals
        var angularVelocity = 40;
        var lastRotation = 0;
        var controlled = false;
        
        var wheelsImg = [];
        var wheelsBmp = [];
        
        // containers
        var wheelContainer;
        var centerButton;
        
        var stage;
        var target, activeWedge, startRotation, startX, startY;
        var rotating = false;
        var realRotate = false;

        scope.$watch(attribute.watchMe,function(newValue, oldValue){
          if (newValue){
            drawWheel();
            bind();
          }
        });
        
        function bind() {
          wheelContainer.addEventListener("mousedown", function(event) { 
            if(rotating || locked) {
              return;
            }
            
            angularVelocity = 0;
            controlled = true;
            target = event.target;
            startRotation = wheelContainer.rotation;
            startX = event.stageX;
            startY = event.stageY;
          });
          
          wheelContainer.addEventListener("pressmove", function(event) { 
            if(controlled) {
                var x1 = event.stageX - wheelContainer.x;
                var y1 = event.stageY - wheelContainer.y;
                var x2 = startX - wheelContainer.x;
                var y2 = startY - wheelContainer.y;
                var angle1 = Math.atan(y1 / x1) * 180 / Math.PI;
                var angle2 = Math.atan(y2 / x2) * 180 / Math.PI;
                var angleDiff = angle2 - angle1;
    
                if ((x1 < 0 && x2 >=0) || (x2 < 0 && x1 >=0)) {
                  angleDiff += 180;
                }
    
                wheelContainer.rotation = startRotation - angleDiff;
            }
          });
          
          wheelContainer.addEventListener("pressup", function(event) { 
            startWheelRotate();
          });
          wheelContainer.addEventListener("mouseout", function(event) { 
            startWheelRotate();
          });
        }
        
        function startWheelRotate() {
          if(controlled && angularVelocity > 360 * 2) {
            realRotate = true;
            centerButton.gotoAndStop(1);
          }
          controlled = false;
          if(angularVelocity > 360*5) {
            angularVelocity = 360*5;
          }
          else if(angularVelocity < -1 * 360*5) {
            angularVelocity = -1 * 360*5;
          }
        }
        
        function drawWheel() {
          // get stage
          if (scope.stage) {
            scope.stage.autoClear = true;
            scope.stage.removeAllChildren();
            scope.stage.update();
          } else {
            scope.stage = new createjs.Stage(element[0]);
          }
          stage = new createjs.Stage(scope.stage.canvas);
          createjs.Touch.enable(stage);
          stage.enableMouseOver(10);
          
          // draw outer bottom
          var img = new Image();
          img.src = "images/outer-edge-wheel.png";
          
          var bmp = new createjs.Bitmap(img);
          bmp.x = 0;
          bmp.y = PADDING_TOP;
          stage.addChild(bmp);
          
          // draw wheel
          wheelContainer = new createjs.Container();
          wheelContainer.x = scope.stage.canvas.width/2;
          wheelContainer.y = (scope.stage.canvas.height + PADDING_TOP)/2;
          wheelContainer.regX = scope.stage.canvas.width/2;
          wheelContainer.regY = (scope.stage.canvas.height - PADDING_TOP)/2;
          var index, len;
          var posX = [0, 0, 0, 0, -215, -299, -300, -214];
          var posY = [-300, -215, 0, 0, 0, 0, -215, -300];
          for (index = 0, len = 8; index < len; ++index) {
            var img = new Image();
            img.src = "images/" + scope.wheelsList[index];
            img.alt = index;
            wheelsImg.push(img);
            
            var bmp = new createjs.Bitmap(img);
            bmp.x = scope.stage.canvas.width/2 + posX[index];
            bmp.y = (scope.stage.canvas.height - PADDING_TOP)/2 + posY[index];
            
            wheelsBmp.push(bmp);
            
            wheelContainer.addChild(bmp);
          }
          stage.addChild(wheelContainer);
          
          // draw spin button
          img = new Image();
          img.src = "images/button.png";
          
          var spriteSheet = new createjs.SpriteSheet({
            images: [img],
            frames: {width: 178, height: 178},
            animations: { out: 0, over: 1, down: 1 }
          });
          centerButton = new createjs.Sprite(spriteSheet, "out");
          centerButton.x = scope.stage.canvas.width/2 - 178/2;
          centerButton.y = (scope.stage.canvas.height + PADDING_TOP)/2 - 178/2;
          stage.addChild(centerButton);
          
          // draw selector
          img = new Image();
          img.src = "images/arrow.png";
          
          bmp = new createjs.Bitmap(img);
          bmp.x = scope.stage.canvas.width/2 - 45;
          bmp.y = 0;
          stage.addChild(bmp);
          
          // update and start ticker
          stage.update();
          createjs.Ticker.timingMode = createjs.Ticker.RAF;
          createjs.Ticker.addEventListener("tick", tick);
        }
        
        function getActiveWheel() {
          var pt = wheelContainer.globalToLocal(scope.stage.canvas.width/2, 50);
          var intersectedWedge = wheelContainer.getObjectUnderPoint(pt.x, pt.y, 0);
          if (intersectedWedge && (!activeWedge || activeWedge.id != intersectedWedge.id)) {
            activeWedge = intersectedWedge;
            scope.wheelselected = activeWedge.image.alt;
            $timeout(function () {
              scope.$apply(function() {
                scope.wheelselected = scope.wheelsIds[activeWedge.image.alt];
                $rootScope.wheelselected = scope.wheelsIds[activeWedge.image.alt];
                $rootScope.$broadcast('wheelChanged');
                //locked = true;
              });
            }, 1);
          }
        }

        function tick(event) {
          // wheel animation
          var angularVelocityChange = angularVelocity / 50;
          angularVelocity -= angularVelocityChange;
          if(controlled) {
            angularVelocity = ((wheelContainer.rotation - lastRotation) * 1000 / 30);
          } else {
            wheelContainer.rotation = (wheelContainer.rotation + angularVelocity / 12) % 360;
          }
          lastRotation = wheelContainer.rotation;
          
          if(realRotate && angularVelocity < 1) {
            getActiveWheel();
          } 
          
          if(angularVelocity < 1) {
            angularVelocity = 0 ;
            rotating = false;
            realRotate = false;
          } else {
            rotating = true;
          }
          
          // update stage
          stage.update();
        }
       }
       
     };
  });
