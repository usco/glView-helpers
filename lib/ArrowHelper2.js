"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
Based on ArrowHelper by : 
 * @author WestLangley / http://github.com/WestLangley
 * @author zz85 / http://github.com/zz85
 * @author bhouston / http://exocortex.com
 *
 * Creates an arrow for visualizing directions
 *
 * Parameters:
 *  dir - Vector3
 *  origin - Vector3
 *  length - Number
 *  color - color in hex value
 *  headLength - Number
 *  headWidth - Number
 */

var ArrowHelper = (function (_THREE$Object3D) {
  _inherits(ArrowHelper, _THREE$Object3D);

  function ArrowHelper(dir, origin, length, color, headLength, headWidth, headType) {
    _classCallCheck(this, ArrowHelper);

    var lineGeometry = new _three2.default.Geometry();
    lineGeometry.vertices.push(new _three2.default.Vector3(0, 0, 0), new _three2.default.Vector3(0, 1, 0));

    var headGeometry = new _three2.default.CylinderGeometry(0, 0.5, 1, 5, 1);
    headGeometry.applyMatrix(new _three2.default.Matrix4().makeTranslation(0, -0.5, 0));

    // dir is assumed to be normalized

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrowHelper).call(this));

    if (color === undefined) color = 0xffff00;
    if (length === undefined) length = 1;
    if (headLength === undefined) headLength = 0.2 * length;
    if (headWidth === undefined) headWidth = 0.2 * headLength;
    if (headType) {
      switch (headType) {
        case "sphere":
          headGeometry = new _three2.default.SphereGeometry(0.5, 32, 32);
          headGeometry.applyMatrix(new _three2.default.Matrix4().makeTranslation(0, -0.5, 0));
          headLength = headWidth;
          break;
        case "arrowOutline":
          var arrowShape = new _three2.default.Shape();
          arrowShape.moveTo(-headWidth / 2, 0);
          arrowShape.lineTo(0, -headLength);
          arrowShape.lineTo(headWidth / 2, 0);
          arrowShape.lineTo(headWidth / 2, 0);
          headGeometry = new _three2.default.ShapeGeometry(arrowShape);
          //let textBorderOutline = new THREE.Line( textBorderGeom, material )
          break;

      }
    }

    _this.position.copy(origin);

    _this.line = new _three2.default.Line(lineGeometry, new _three2.default.LineBasicMaterial({ color: color }));
    _this.line.matrixAutoUpdate = false;
    _this.add(_this.line);

    _this.head = new _three2.default.Mesh(headGeometry, new _three2.default.MeshBasicMaterial({ color: color }));
    _this.head.matrixAutoUpdate = false;
    _this.add(_this.head);

    _this.setDirection(dir);
    _this.setLength(length, headLength, headWidth);
    return _this;
  }

  _createClass(ArrowHelper, [{
    key: "setDirection",
    value: function setDirection(dir) {
      var axis = new _three2.default.Vector3();
      var radians;
      // dir is assumed to be normalized

      if (dir.y > 0.99999) {

        this.quaternion.set(0, 0, 0, 1);
      } else if (dir.y < -0.99999) {

        this.quaternion.set(1, 0, 0, 0);
      } else {

        axis.set(dir.z, 0, -dir.x).normalize();

        radians = Math.acos(dir.y);

        this.quaternion.setFromAxisAngle(axis, radians);
      }
    }
  }, {
    key: "setLength",
    value: function setLength(length, headLength, headWidth) {
      if (headLength === undefined) headLength = 0.2 * length;
      if (headWidth === undefined) headWidth = 0.2 * headLength;

      this.line.scale.set(1, length - headLength, 1);
      this.line.updateMatrix();

      this.head.scale.set(headWidth, headLength, headWidth);
      this.head.position.y = length;
      this.head.updateMatrix();
    }
  }, {
    key: "setColor",
    value: function setColor(color) {
      this.line.material.color.set(color);
      this.head.material.color.set(color);
    }
  }]);

  return ArrowHelper;
})(_three2.default.Object3D);

exports.default = ArrowHelper;