'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zoomToFit;
exports.pointCameraTo = pointCameraTo;

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _computeBounds = require('../meshTools/computeBounds');

var _computeCenterOfGravity = require('../meshTools/computeCenterOfGravity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//from http://stackoverflow.com/questions/15761644/threejs-how-to-implement-zoomall-and-make-sure-a-given-box-fills-the-canvas-are
/**
 *  Zoom to object
 */
function zoomToFit(object, camera, target) {

  var bbox = (0, _computeBounds.computeBoundingBox)(object);
  if (bbox.empty()) {
    return;
  }
  var COG = bbox.center();

  pointCameraTo(COG, target, camera);
  camera.lookAt(COG);

  var sphereSize = bbox.size().length() * 0.5;
  var distToCenter = sphereSize / Math.sin(Math.PI / 180.0 * camera.fov * 0.5);

  // move the camera backward
  var vec = new _three2.default.Vector3();

  vec.subVectors(camera.position, target);
  vec.setLength(distToCenter);
  camera.position.addVectors(vec, target);
  camera.updateProjectionMatrix();
}

/**
 * point the current camera to the center
 * of the graphical object (zoom factor is not affected)
 *
 * the camera is moved in its  x,z plane so that the orientation 
 * is not affected either
 */
function pointCameraTo(COG, target, camera) {
  // Refocus camera to the center of the new object
  var v = new _three2.default.Vector3();
  v.subVectors(COG, target);

  camera.position.addVectors(camera.position, v);
}