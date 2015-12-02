"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OutlineObject = function OutlineObject(options) {
  var options = options || {};
  this.outlineColor = options.color || "#FF0000";
};

OutlineObject.prototype = {
  constructor: OutlineObject
};

OutlineObject.prototype.addTo = function (object, options) {
  if (!object) return;

  //add to new selection
  var outlineMaterial = new _three2.default.MeshBasicMaterial({
    color: this.outlineColor,
    side: _three2.default.BackSide
  });

  var outline = new _three2.default.Mesh(object.geometry, outlineMaterial);

  outline.selectable = false;
  outline.selectTrickleUp = true;
  outline.transformable = false;
  outline.name = "selectionOutline";

  outline.material.depthTest = true;
  outline.material.depthWrite = true;
  outline.scale.multiplyScalar(1.02);

  object._outline = outline;
  object.add(outline);
};

OutlineObject.prototype.removeFrom = function (object, options) {
  if (!object) return;

  if (!object._outline) return;
  //remove from old selection
  object.remove(object._outline);
  delete object._outline;
};

exports.default = OutlineObject;