"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _Mirror = require("./Mirror");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MirrorPlane = (function (_THREE$Object3D) {
  _inherits(MirrorPlane, _THREE$Object3D);

  function MirrorPlane(width, length, resolution, color, upVector) {
    _classCallCheck(this, MirrorPlane);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MirrorPlane).call(this));

    _this.width = width || 200;
    _this.length = length || 200;
    _this.resolution = resolution || 128;
    _this.color = color || 0x777777;
    _this.upVector = upVector || new _three2.default.Vector3(0, 1, 0);

    _this.userData.unselectable = true; // this should never be selectable
    _this._drawPlane();
    return _this;
  }

  _createClass(MirrorPlane, [{
    key: "_drawPlane",
    value: function _drawPlane() {
      //create plane for shadow projection  
      var width = this.width;
      var length = this.length;

      var groundMirror = new _Mirror.THREE_Mirror(null, null, { clipBias: 0.003, textureWidth: this.resolution, textureHeight: this.resolution, color: this.color });
      var planeGeometry = new _three2.default.PlaneBufferGeometry(width, length, 1, 1);
      var planeMaterial = groundMirror.material;

      //create plane for reflection
      this.plane = new _three2.default.Mesh(planeGeometry, planeMaterial);
      this.plane.position.z = -0.8;
      this.plane.doubleSided = true;
      this.name = "MirrorPlane";
      this.plane.add(groundMirror);
      this.mirrorCamera = groundMirror;

      this.add(this.plane);
    }
  }, {
    key: "setUp",
    value: function setUp(upVector) {
      this.upVector = upVector;
      this.up = upVector;
      this.lookAt(upVector);
    }
  }]);

  return MirrorPlane;
})(_three2.default.Object3D);

//export { MirrorPlane };

module.exports = MirrorPlane;