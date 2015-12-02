"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShadowPlane = (function (_THREE$Object3D) {
  _inherits(ShadowPlane, _THREE$Object3D);

  function ShadowPlane(width, length, shadowColor, upVector) {
    _classCallCheck(this, ShadowPlane);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ShadowPlane).call(this));

    _this.width = width || 200;
    _this.length = length || 200;
    _this.shadowColor = shadowColor || new _three2.default.Color(1, 1, 1);
    _this.upVector = upVector || new _three2.default.Vector3(0, 1, 0);

    _this.userData.unselectable = true; // this should never be selectable
    _this._drawPlane();
    return _this;
  }

  _createClass(ShadowPlane, [{
    key: "_drawPlane",
    value: function _drawPlane() {
      //create plane for shadow projection  
      var width = this.width;
      var length = this.length;
      var shadowColor = this.shadowColor;

      var planeGeometry = new _three2.default.PlaneBufferGeometry(-width, length, 1, 1);
      var planeFragmentShader = ["uniform vec3 diffuse;", "uniform float opacity;", "uniform vec3 shadowColor;", _three2.default.ShaderChunk["color_pars_fragment"], _three2.default.ShaderChunk["map_pars_fragment"], _three2.default.ShaderChunk["lightmap_pars_fragment"], _three2.default.ShaderChunk["envmap_pars_fragment"], _three2.default.ShaderChunk["fog_pars_fragment"], _three2.default.ShaderChunk["shadowmap_pars_fragment"], _three2.default.ShaderChunk["specularmap_pars_fragment"], "void main() {", "gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );", _three2.default.ShaderChunk["map_fragment"], _three2.default.ShaderChunk["alphatest_fragment"], _three2.default.ShaderChunk["specularmap_fragment"], _three2.default.ShaderChunk["lightmap_fragment"], _three2.default.ShaderChunk["color_fragment"], _three2.default.ShaderChunk["envmap_fragment"], _three2.default.ShaderChunk["shadowmap_fragment"], _three2.default.ShaderChunk["linear_to_gamma_fragment"], _three2.default.ShaderChunk["fog_fragment"], "gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 - shadowColor.x );", "}"].join("\n");

      //= vec3(0.0,0.0,0.0)
      var uniforms = _three2.default.ShaderLib['basic'].uniforms;
      if (!("shadowColor" in uniforms)) {
        uniforms["shadowColor"] = { type: 'c', value: shadowColor };
      }

      var planeMaterial = new _three2.default.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: _three2.default.ShaderLib['basic'].vertexShader,
        fragmentShader: planeFragmentShader,
        color: 0x0000FF,
        transparent: true
      });

      //create plane for shadow projection   
      this.plane = new _three2.default.Mesh(planeGeometry, planeMaterial);
      this.plane.rotation.x = Math.PI;
      this.plane.position.z = -0.2;
      this.name = "shadowPlane";
      this.plane.receiveShadow = true;
      this.plane.castShadow = false;

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

  return ShadowPlane;
})(_three2.default.Object3D);

//export { ShadowPlane };

module.exports = ShadowPlane;