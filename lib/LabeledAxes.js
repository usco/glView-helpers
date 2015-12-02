'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _ArrowHelper = require('./ArrowHelper');

var _ArrowHelper2 = _interopRequireDefault(_ArrowHelper);

var _LabelHelper = require('./LabelHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LabeledAxes = (function (_THREE$Object3D) {
  _inherits(LabeledAxes, _THREE$Object3D);

  function LabeledAxes(options) {
    _classCallCheck(this, LabeledAxes);

    /*const DEFAULTS = {
      name : "",
      debug:false
    }
    let options = Object.assign({}, DEFAULTS, options); 
    super(options);
    
    Object.assign(this, options);*/

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LabeledAxes).call(this));

    var options = options || {};
    _this.size = options.size !== undefined ? options.size : 50;
    _this.xColor = options.xColor !== undefined ? options.xColor : "#FF7700";
    _this.yColor = options.yColor !== undefined ? options.yColor : "#77FF00";
    _this.zColor = options.zColor !== undefined ? options.zColor : "#0077FF";

    _this.fontSize = options.fontSize !== undefined ? options.fontSize : 8;
    _this.textColor = options.textColor !== undefined ? options.textColor : "#000";
    _this.fontFace = options.fontFace !== undefined ? options.fontFace : "Jura";
    _this.arrowSize = options.arrowSize !== undefined ? options.arrowSize : 3;

    var addLabels = options.addLabels !== undefined ? options.addLabels : true;
    var addArrows = options.addArrows !== undefined ? options.addArrows : true;

    _this.xColor = new _three2.default.Color(_this.xColor);
    _this.yColor = new _three2.default.Color(_this.yColor);
    _this.zColor = new _three2.default.Color(_this.zColor);

    if (addLabels == true) {
      var s = _this.size;
      var fontSize = _this.fontSize;

      var textOptions = {
        fontSize: _this.fontSize,
        fontFace: _this.fontFace,
        //fontWeight: this.fontWeight,
        //fontStyle: this.fontStyle,
        color: _this.textColor,
        bgColor: _this.textBgColor,
        highlightColor: _this.highlightColor
      };

      _this.xLabel = //this._drawText("X",fontSize);
      new _LabelHelper.LabelHelper3d(Object.assign({ text: "X" }, textOptions));
      _this.xLabel.position.set(s, 0, 0);

      _this.yLabel = new _LabelHelper.LabelHelper3d(Object.assign({ text: "Y" }, textOptions));
      _this.yLabel.position.set(0, s, 0);

      _this.zLabel = new _LabelHelper.LabelHelper3d(Object.assign({ text: "Z" }, textOptions));
      _this.zLabel.position.set(0, 0, s);
    }
    if (addArrows == true) {
      s = _this.size / 1.25; // THREE.ArrowHelper arrow length
      _this.xArrow = new _ArrowHelper2.default(new _three2.default.Vector3(1, 0, 0), new _three2.default.Vector3(0, 0, 0), s, _this.xColor, _this.arrowSize);
      _this.yArrow = new _ArrowHelper2.default(new _three2.default.Vector3(0, 1, 0), new _three2.default.Vector3(0, 0, 0), s, _this.yColor, _this.arrowSize);
      _this.zArrow = new _ArrowHelper2.default(new _three2.default.Vector3(0, 0, 1), new _three2.default.Vector3(0, 0, 0), s, _this.zColor, _this.arrowSize);
      _this.add(_this.xArrow);
      _this.add(_this.yArrow);
      _this.add(_this.zArrow);
    } else {
      _this._buildAxes();
    }

    _this.add(_this.xLabel);
    _this.add(_this.yLabel);
    _this.add(_this.zLabel);
    _this.name = "axes";

    //Make sure arrows are always visible (through objects)
    //not working in all cases ?
    _this.xArrow.line.material.depthTest = false;
    _this.xArrow.head.material.depthTest = false;

    _this.yArrow.line.material.depthTest = false;
    _this.yArrow.head.material.depthTest = false;

    _this.zArrow.line.material.depthTest = false;
    _this.zArrow.head.material.depthTest = false;
    return _this;
  }

  _createClass(LabeledAxes, [{
    key: 'toggle',
    value: function toggle(_toggle) {
      //apply visibility settings to all children
      this.traverse(function (child) {
        child.visible = _toggle;
      });
    }
  }, {
    key: '_buildAxes',
    value: function _buildAxes() {

      lineGeometryX = new _three2.default.Geometry();
      lineGeometryX.vertices.push(new _three2.default.Vector3(-this.size, 0, 0));
      lineGeometryX.vertices.push(new _three2.default.Vector3(this.size, 0, 0));
      xLine = new _three2.default.Line(lineGeometryX, new _three2.default.LineBasicMaterial({ color: this.xColor }));

      lineGeometryY = new _three2.default.Geometry();
      lineGeometryY.vertices.push(new _three2.default.Vector3(0, -this.size, 0));
      lineGeometryY.vertices.push(new _three2.default.Vector3(0, this.size, 0));
      yLine = new _three2.default.Line(lineGeometryY, new _three2.default.LineBasicMaterial({ color: this.yColor }));

      lineGeometryZ = new _three2.default.Geometry();
      lineGeometryZ.vertices.push(new _three2.default.Vector3(0, 0, -this.size));
      lineGeometryZ.vertices.push(new _three2.default.Vector3(0, 0, this.size));
      zLine = new _three2.default.Line(lineGeometryZ, new _three2.default.LineBasicMaterial({ color: this.zColor }));

      this.add(xLine);
      this.add(yLine);
      this.add(zLine);
    }
  }, {
    key: '_drawText',
    value: function _drawText(text, fontSize, fontFace, textColor, background, scale) {
      var fontSize = fontSize || 18;
      var fontFace = fontFace || "Arial";
      var textColor = textColor || "#000000";
      var background = background || false;
      var scale = scale || 1.0;

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      context.font = "Bold " + fontSize + "px " + fontFace;

      // get size data (height depends only on font size)
      var metrics = context.measureText(text);
      var textWidth = metrics.width;

      // text color
      context.strokeStyle = textColor;
      context.fillStyle = textColor;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      //context.strokeText(text, canvas.width/2, canvas.height/2)

      // canvas contents will be used for a texture
      var texture = new _three2.default.Texture(canvas);
      texture.needsUpdate = true;

      var spriteMaterial = new _three2.default.SpriteMaterial({ map: texture, useScreenCoordinates: false, color: 0xffffff });
      spriteMaterial.depthTest = false;
      //spriteMaterial.renderDepth = 1e20

      var sprite = new _three2.default.Sprite(spriteMaterial);
      sprite.scale.set(100 * scale, 50 * scale, 1.0);
      return sprite;
    }
  }]);

  return LabeledAxes;
})(_three2.default.Object3D);

//module.exports = LabeledAxes;
//weird issues with export: apparently browserify sets a "is_es_Module" flag

exports.default = LabeledAxes;