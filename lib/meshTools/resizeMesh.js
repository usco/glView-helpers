"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resizeMesh;

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resizeMesh(object, minSize, maxSize) {
  minSize = minSize || 0.2;
  maxSize = maxSize || 500;
  //if(!object.boundingSphere) computeObject3DBoundingSphere( object );
  //FIXME: bsphere can be present but with a radius == infinity etc
  computeObject3DBoundingSphere(object);

  var size = object.boundingSphere.radius;
  if (size < minSize) {
    var ratio = object.boundingSphere.radius / minSize;
    var scaling = 1 / ratio;
    object.applyMatrix(new _three2.default.Matrix4().makeScale(scaling, scaling, scaling));
  } else if (size > maxSize) {
    var ratio = object.boundingSphere.radius / maxSize;
    var scaling = 1 / ratio;
    object.applyMatrix(new _three2.default.Matrix4().makeScale(scaling, scaling, scaling));
  }
}