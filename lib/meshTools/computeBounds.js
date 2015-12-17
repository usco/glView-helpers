'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeBoundingBox = computeBoundingBox;
exports.computeBoundingSphere = computeBoundingSphere;

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function computeBoundingBox(object, force) {
  var force = force === undefined ? false : force;

  if (object.geometry === undefined) {
    var bbox = new _three2.default.Box3();
  } else {

    if (!object.geometry.boundingBox || force) {
      object.geometry.computeBoundingBox();
    }
    var bbox = object.geometry.boundingBox.clone();
  }

  object.traverse(function (child) {

    if (child instanceof _three2.default.Mesh) {
      if (child.geometry !== undefined) {

        if (!child.geometry.boundingBox || force) {
          child.geometry.computeBoundingBox();
        }
        var childBox = child.geometry.boundingBox.clone();
        childBox.translate(child.localToWorld(new _three2.default.Vector3()));
        bbox.union(childBox);
      }
    }
  });
  object.boundingBox = bbox;
  return bbox;
}

function computeBoundingSphere(object, force) {
  var bbox = new _three2.default.Box3().setFromObject(object);

  if (object.boundingBox) object.boundingBox.copy(bbox);
  if (!object.boundingBox) object.boundingBox = bbox;
  object.boundingSphere = bbox.getBoundingSphere();
  return object.boundingSphere;
}