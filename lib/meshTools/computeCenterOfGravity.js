"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = computeCenterOfGravity;
function computeCenterOfGravity(boundingBox) {

  return THREE.addVectors(boundingBox.min, boundingBox.max).divideScalar(2);
}