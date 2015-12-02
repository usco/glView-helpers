"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = centerMesh;

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _computeBounds = require("./computeBounds");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function centerMesh(object, onX, onY, onZ) {
  //TODO: should this be added to our object/mesh classes
  onX = onX === undefined ? false : onX;
  onY = onY === undefined ? false : onY;
  onZ = onZ === undefined ? false : onZ;

  //centering hack
  if (!object.boundingSphere) (0, _computeBounds.computeBoundingSphere)(object);
  var offset = object.boundingSphere.center;

  object.traverse(function (item) {
    if (item.geometry) {
      item.geometry.applyMatrix(new _three2.default.Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
    }
  });

  //offset to move the object above given planes
  if (onZ) {
    var h = object.boundingBox.max.z - object.boundingBox.min.z;
    object.applyMatrix(new _three2.default.Matrix4().makeTranslation(0, 0, h / 2));
  }

  if (onY) {
    var d = object.boundingBox.max.y - object.boundingBox.min.y;
    object.applyMatrix(new _three2.default.Matrix4().makeTranslation(0, d / 2, 0));
  }

  if (onX) {
    var w = object.boundingBox.max.x - object.boundingBox.min.x;
    object.applyMatrix(new _three2.default.Matrix4().makeTranslation(w / 2, 0, 0));
  }
  return object;
}