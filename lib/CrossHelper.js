"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _BaseHelper2 = require("./BaseHelper");

var _BaseHelper3 = _interopRequireDefault(_BaseHelper2);

var _GizmoMaterial = require("./GizmoMaterial");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 id: inner diameter : blank space at center of cross
*/

var CrossHelper = (function (_BaseHelper) {
  _inherits(CrossHelper, _BaseHelper);

  function CrossHelper(options) {
    _classCallCheck(this, CrossHelper);

    var DEFAULTS = {
      size: 5,
      color: "#0F0",
      highlightColor: "#F00",
      opacity: 0.8,
      internalDiameter: 0 //??huh
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CrossHelper).call(this, options));

    Object.assign(_this, options);

    var internalDiameter = _this.internalDiameter;
    var opacity = _this.opacity;
    var size = _this.size;

    var offsetPos = size / 2 + internalDiameter / 2;
    //starting point cross
    var startCrossGeometry = new _three2.default.Geometry();
    startCrossGeometry.vertices.push(new _three2.default.Vector3(0, -offsetPos, 0));
    startCrossGeometry.vertices.push(new _three2.default.Vector3(0, -internalDiameter / 2, 0));
    startCrossGeometry.vertices.push(new _three2.default.Vector3(0, offsetPos, 0));
    startCrossGeometry.vertices.push(new _three2.default.Vector3(0, internalDiameter / 2, 0));

    startCrossGeometry.vertices.push(new _three2.default.Vector3(-offsetPos, 0, 0));
    startCrossGeometry.vertices.push(new _three2.default.Vector3(-internalDiameter / 2, 0, 0));
    startCrossGeometry.vertices.push(new _three2.default.Vector3(offsetPos, 0, 0));
    startCrossGeometry.vertices.push(new _three2.default.Vector3(internalDiameter / 2, 0, 0));

    _this.centerCross = new _three2.default.Line(startCrossGeometry, new _GizmoMaterial.GizmoLineMaterial({
      color: _this.color,
      highlightColor: _this.highlightColor,
      lineWidth: _this.lineWidth,
      opacity: opacity,
      transparent: true,
      side: _three2.default.FrontSide }), _three2.default.LinePieces);
    _this.centerCross.material.depthTest = false;
    _this.centerCross.material.depthWrite = false;
    _this.centerCross.material.renderDepth = 1e20;

    _this.add(_this.centerCross);
    return _this;
  }

  return CrossHelper;
})(_BaseHelper3.default);

exports.default = CrossHelper;