"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _BaseHelper2 = require("./BaseHelper");

var _BaseHelper3 = _interopRequireDefault(_BaseHelper2);

var _GizmoMaterial = require("./GizmoMaterial");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO:should inherit from THREE.MESH, but some weird stuff going on

var LineHelper = (function (_BaseHelper) {
  _inherits(LineHelper, _BaseHelper);

  function LineHelper(options) {
    _classCallCheck(this, LineHelper);

    var DEFAULTS = {
      start: new _three2.default.Vector3(),
      end: new _three2.default.Vector3(),
      length: 0,

      lineWidth: 1,
      color: "#000"
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LineHelper).call(this, options));

    Object.assign(_this, options);

    console.log("LINE", _this.lineWidth);
    _this.material = new _GizmoMaterial.GizmoLineMaterial({
      lineWidth: _this.lineWidth,
      color: _this.color,
      opacity: 0.4,
      transparent: true,
      highlightColor: _this.highlightColor });
    _this._updateGeometry();
    //super( this._geometry, this._material ) 
    return _this;
  }

  _createClass(LineHelper, [{
    key: "_makeGeometry",
    value: function _makeGeometry() {
      if (!this.start || !this.end) return;
      this._geometry = new _three2.default.Geometry();

      this._geometry.vertices.push(this.start);
      this._geometry.vertices.push(this.end);
      /**/
    }
  }, {
    key: "_updateGeometry",
    value: function _updateGeometry() {
      /*this.geometry.dynamic = true
      this.geometry.vertices[0] = this.start 
      this.geometry.vertices[1] = this.end 
      this.geometry.verticesNeedUpdate = true*/

      if (!this.start || !this.end) return;
      var geometry = new _three2.default.Geometry();

      geometry.vertices.push(this.start);
      geometry.vertices.push(this.end);

      if (this.line) this.remove(this.line);
      this.line = new _three2.default.Line(geometry, this.material);
      this.add(this.line);
    }
  }, {
    key: "setStart",
    value: function setStart(start) {
      this.start = start || new _three2.default.Vector3();
      this._updateGeometry();
    }
  }, {
    key: "setEnd",
    value: function setEnd(end) {
      this.end = end || new _three2.default.Vector3();
      this._updateGeometry();
    }
  }, {
    key: "setLength",
    value: function setLength(length) {
      this.length = length || 0;
      this.end = this.end.clone().sub(this.start).setLength(this.length);
      this._updateGeometry();
    }
  }]);

  return LineHelper;
})(_BaseHelper3.default);

module.exports = LineHelper;