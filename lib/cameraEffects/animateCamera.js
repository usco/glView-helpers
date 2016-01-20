"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = animateCamera;
function animateCamera(camera, duration, params) {
  //{ pos:camTgt, tgt:camTgtTarget}
  var camPos = camera.position.clone();
  var camTgt = (camera.target || new THREE.Vector3()).clone();

  var camPosTarget = params.pos;
  var camTgtTarget = params.tgt;

  //params = params || {starts:[],duration:0}
  //const duration = params.duration

  /*return params.starts.map(function(start, index){
     return new TWEEN.Tween( start )
      .to( camPosTarget , duration )
      .easing( params.easing[index] || TWEEN.Easing.Quadratic.In )
      .onUpdate( function () {
        camera.position.copy(camPos) 
      } )
      .start()
  })*/

  var tween = new TWEEN.Tween(camPos).to(camPosTarget, duration).easing(TWEEN.Easing.Quadratic.In).onUpdate(function () {
    camera.position.copy(camPos);
  }).start();

  var tween2 = new TWEEN.Tween(camTgt).to(camTgtTarget, duration).easing(TWEEN.Easing.Quadratic.In).onUpdate(function () {
    camera.target.copy(camTgt);
  }).start();
}