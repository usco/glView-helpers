"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
//TODO: make this into a mesh / geometry subclass
*/

var CircleHelper = (function (_BaseHelper) {
  _inherits(CircleHelper, _BaseHelper);

  function CircleHelper(options) {
    _classCallCheck(this, CircleHelper);

    var defaultMaterial = new _GizmoMaterial.GizmoLineMaterial({
      color: "#000",
      depthTest: false,
      depthWrite: false,
      renderDepth: 1e20,
      highlightColor: "#F00"
    });

    var DEFAULTS = {
      radius: 0,
      direction: new _three2.default.Vector3(),

      color: "#000",
      highlightColor: "#F00",

      material: defaultMaterial
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CircleHelper).call(this, options));

    Object.assign(_this, options);

    _this.setRadius(_this.radius);
    return _this;
  }

  _createClass(CircleHelper, [{
    key: "setRadius",
    value: function setRadius(radius) {
      var circleRadius = this.radius = radius;
      var circleShape = new _three2.default.Shape();
      circleShape.moveTo(0, 0);
      circleShape.absarc(0, 0, circleRadius, 0, Math.PI * 2, false);
      circleShape.moveTo(0, 0);
      var points = circleShape.createSpacedPointsGeometry(100);

      if (this.rCircle) this.remove(this.rCircle);

      this.rCircle = new _three2.default.Line(points, this.material);
      this.add(this.rCircle);
    }
  }]);

  return CircleHelper;
})(_BaseHelper3.default);

exports.default = CircleHelper;