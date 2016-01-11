'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zoomInOn;

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _tween = require('tween.js');

var _tween2 = _interopRequireDefault(_tween);

var _assign2 = require('fast.js/object/assign');

var _assign3 = _interopRequireDefault(_assign2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//faster object.assign

function zoomInOn(object, camera, options) {

  var defaults = {
    position: undefined //to force a given "point " vector
    , orientation: undefined //to force a given "look at " vector
    , distance: 3,
    zoomTime: 400,
    precision: 0.001
  };

  if (!object) return;
  if (!camera) return;

  var _assign = (0, _assign3.default)({}, defaults, options);

  var position = _assign.position;
  var orientation = _assign.orientation;
  var distance = _assign.distance;
  var zoomTime = _assign.zoomTime;
  var precision = _assign.precision;

  console.log("ZoomInOnObject", object, options);

  if (!position) {
    distance = object.boundingSphere.radius * distance;
    position = object.position.clone();
  } else {
    distance = position.clone().sub(object.position).length() * distance * 2;
  }

  var camPos = camera.position.clone();
  var camTgt = (camera.target || new _three2.default.Vector3()).clone();
  var camTgtTarget = position.clone();
  var camPosTarget = camera.position.clone().sub(position);

  //camera.target.copy( object.position );
  //determin camera "look-at" vector
  var camLookatVector = new _three2.default.Vector3(0, 0, 1);
  camLookatVector.applyQuaternion(camera.quaternion);
  camLookatVector.normalize();
  camLookatVector.multiplyScalar(distance);
  camLookatVector = position.clone().add(camLookatVector);

  camPosTarget = camLookatVector;

  //Simply using vector.equals( otherVector) is not good enough
  if (Math.abs(camPos.x - camPosTarget.x) <= precision && Math.abs(camPos.y - camPosTarget.y) <= precision && Math.abs(camPos.z - camPosTarget.z) <= precision) {
    //already at target, do nothing
    return;
  }

  //possible api change, to have function return data instead of mutating anything, making things more testable too
  /*
    //return a set of end /final points , both for the position...and target
    return { pos:camTgt, tgt:camTgtTarget}
  
    }
    return {
    starts:[camPos,camTgt]//order matters
    ,ends:[camTgt, camTgtTarget]
    ,attrs:["position","target"]
    ,easing:[TWEEN.Easing.Quadratic.In,TWEEN.Easing.Quadratic.In]
    ,duration:zoomTime}
   function animateCamera(camera, params){
    params = params || {starts:[],duration:0}
    const duration = params.duration
     return params.starts.map(function(start, index){
       return new TWEEN.Tween( start )
        .to( camPosTarget , duration )
        .easing( params.easing[index] || TWEEN.Easing.Quadratic.In )
        .onUpdate( function () {
          camera.position.copy(camPos);  
        } )
        .start()
    })
  }*/

  var tween = new _tween2.default.Tween(camPos).to(camPosTarget, zoomTime).easing(_tween2.default.Easing.Quadratic.In).onUpdate(function () {
    camera.position.copy(camPos);
  }).start();

  var tween2 = new _tween2.default.Tween(camTgt).to(camTgtTarget, zoomTime).easing(_tween2.default.Easing.Quadratic.In).onUpdate(function () {
    camera.target.copy(camTgt);
  }).start();
  //tween2.chain( tween );
  //tween2.start();
}