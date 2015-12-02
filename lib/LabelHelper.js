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

var LabelHelper = (function (_BaseHelper) {
  _inherits(LabelHelper, _BaseHelper);

  function LabelHelper(options) {
    _classCallCheck(this, LabelHelper);

    var DEFAULTS = {
      text: "",
      color: "rgba(0, 0, 0, 1)",
      bgColor: "rgba(255, 255, 255, 1)",
      background: true,
      fontSize: 10,
      fontFace: "Jura", //Open Sans
      fontWeight: "bold",
      fontStyle: "",

      borderSize: 0,
      alphaTest: 0.1,
      upscale: 10, //texture upscaling ratio
      baseRatio: 4 };

    //convertion of canvas to webglUnits
    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LabelHelper).call(this, options));

    Object.assign(_this, options);

    _this.width = 0;
    _this.height = 0;

    _this.canvas = document.createElement('canvas');
    _this.canvas.style.position = "absolute";
    _this.canvas.width = 256;
    _this.canvas.height = 256;

    _this.context = _this.canvas.getContext('2d');
    var texture = new _three2.default.Texture(_this.canvas);
    _this.texture = texture;

    _this.measureText();
    _this.drawText();
    return _this;
  }

  _createClass(LabelHelper, [{
    key: "clear",
    value: function clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this._texture.needsUpdate = true;
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.text = text;

      this.measureText();
      this.drawText();
      this.generate();
    }
  }, {
    key: "applyFontStyleToContext",
    value: function applyFontStyleToContext(measureMode) {
      measureMode = measureMode !== undefined ? measureMode : true;

      var fontSize = this.charHeight;
      if (!measureMode) fontSize = this.scaledFontSize;

      var font = this.fontWeight + " " + this.fontStyle + " " + fontSize + "px " + this.fontFace;

      this.context.font = font;
      this.context.textBaseline = "middle";
      this.context.textAlign = "center";
    }
  }, {
    key: "measureText",
    value: function measureText(text) {
      var pixelRatio = window.devicePixelRatio || 1;
      var charWidth = 0;
      var charHeight = pixelRatio * this.fontSize;

      var canvas = this.canvas;
      var context = this.context;
      var fontFace = this.fontFace;
      var fontWeight = this.fontWeight;
      var fontStyle = this.fontStyle;
      var borderSize = this.borderSize;

      this.applyFontStyleToContext();

      function getPowerOfTwo(value, pow) {
        pow = pow || 1;
        while (pow < value) {
          pow *= 2;
        }
        return pow;
      }

      //FIXME: hackery based on measurement of specific characters
      charWidth = context.measureText(Array(100 + 1).join('M')).width / 100;
      this.charWidth = charWidth;
      this.charHeight = charHeight;

      charWidth = context.measureText(Array(100 + 1).join('M')).width / 100;
      charHeight = this.fontSize;

      var rWidth = charWidth * this.text.length;
      var rHeight = charHeight;
      var textWidth = context.measureText(text).width;

      textWidth = rWidth;
      var sqrWidth = getPowerOfTwo(textWidth);
      var sqrHeight = getPowerOfTwo(2 * this.fontSize);

      var upscale = this.upscale;
      var baseRatio = this.baseRatio;

      sqrWidth *= upscale;
      sqrHeight *= upscale;

      this.canvasWidth = sqrWidth;
      this.canvasHeight = sqrHeight;

      this.width = sqrWidth / (upscale * baseRatio);
      this.height = sqrHeight / (upscale * baseRatio);

      this.scaledFontSize = this.fontSize * upscale;

      this.textWidth = textWidth * upscale / (upscale * baseRatio);
      this.textHeight = rHeight * upscale / (upscale * baseRatio);

      //console.log("canvas",sqrWidth, sqrHeight,"Width/height",this.width,this.height,"text (glSizes)",this.textWidth,this.textHeight)
    }
  }, {
    key: "drawText",
    value: function drawText() {
      var canvas = this.canvas;
      var context = this.context;
      var text = this.text;

      var color = this.color;

      var fontWeight = this.fontWeight;
      var fontStyle = this.fontStyle;
      var fontFace = this.fontFace;
      var charHeight = this.charHeight;

      canvas.width = this.canvasWidth;
      canvas.height = this.canvasHeight;

      this.applyFontStyleToContext(false);

      context.clearRect(0, 0, canvas.width, canvas.height);

      //context.fillStyle = "#000000"
      //context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = "#ffffff";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      //textWidth
      //ctx.strokeStyle="red"
      //ctx.rect((canvas.width-rWidth)/2,(canvas.height-rHeight)/2,rWidth,rHeight)
      //ctx.stroke()

      var texture = new _three2.default.Texture(canvas);
      texture.needsUpdate = true;
      texture.generateMipmaps = true;
      texture.magFilter = _three2.default.LinearFilter;
      texture.minFilter = _three2.default.LinearFilter;
      this._texture = texture;
    }
  }]);

  return LabelHelper;
})(_BaseHelper3.default);

/*Perspective 3d helpers*/

var LabelHelper3d = (function (_LabelHelper) {
  _inherits(LabelHelper3d, _LabelHelper);

  function LabelHelper3d(options) {
    _classCallCheck(this, LabelHelper3d);

    var DEFAULTS = {};

    options = Object.assign({}, DEFAULTS, options);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(LabelHelper3d).call(this, options));

    Object.assign(_this2, options);

    _this2.generate();
    return _this2;
  }

  _createClass(LabelHelper3d, [{
    key: "generate",
    value: function generate() {
      var spriteMaterial = new _three2.default.SpriteMaterial({
        map: this._texture,
        transparent: true,
        alphaTest: this.alphaTest,
        useScreenCoordinates: false,
        scaleByViewport: false,
        color: this.color,
        side: _three2.default.DoubleSide
      });

      //depthTest:false,
      //depthWrite:false,
      //renderDepth : 1e20
      var width = this.width;
      var height = this.height;

      var textSprite = new _three2.default.Sprite(spriteMaterial);
      textSprite.scale.set(width, height, 1.0);

      this.textSprite = textSprite;
      this.add(textSprite);
    }
  }]);

  return LabelHelper3d;
})(LabelHelper);

/*Flat (perspective not front facing) helper*/

var LabelHelperPlane = (function (_LabelHelper2) {
  _inherits(LabelHelperPlane, _LabelHelper2);

  function LabelHelperPlane(options) {
    _classCallCheck(this, LabelHelperPlane);

    var DEFAULTS = {
      highlightColor: "#F00"
    };
    options = Object.assign({}, DEFAULTS, options);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(LabelHelperPlane).call(this, options));

    Object.assign(_this3, options);
    _this3.generate();
    return _this3;
  }

  _createClass(LabelHelperPlane, [{
    key: "generate",
    value: function generate() {
      var width = this.width;
      var height = this.height;
      //console.log("width", width,"height", height)

      var material = new _GizmoMaterial.GizmoMaterial({
        map: this._texture,
        transparent: true,
        color: this.color,
        highlightColor: this.highlightColor,
        alphaTest: this.alphaTest,
        side: _three2.default.FrontSide,
        shading: _three2.default.FlatShading
      });

      /*depthTest:false,
       depthWrite:false,
       renderDepth : 1e20,*/

      var textPlane = new _three2.default.Mesh(new _three2.default.PlaneBufferGeometry(width, height), material);

      if (this.textMesh) this.remove(this.textMesh);

      this.textMesh = textPlane;
      this.add(textPlane);

      if (this.textPlaneBack) this.remove(this.textPlaneBack);

      this.textPlaneBack = textPlane.clone();
      this.textPlaneBack.rotation.y = -Math.PI;
      this.add(this.textPlaneBack);
    }
  }]);

  return LabelHelperPlane;
})(LabelHelper);

//export {}

module.exports = { LabelHelperPlane: LabelHelperPlane, LabelHelper3d: LabelHelper3d };