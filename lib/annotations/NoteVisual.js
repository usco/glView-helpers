"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _AnnotationVisual2 = require("./AnnotationVisual");

var _AnnotationVisual3 = _interopRequireDefault(_AnnotationVisual2);

var _CrossHelper = require("../CrossHelper");

var _CrossHelper2 = _interopRequireDefault(_CrossHelper);

var _CircleHelper = require("../CircleHelper");

var _CircleHelper2 = _interopRequireDefault(_CircleHelper);

var _GizmoMaterial = require("../GizmoMaterial");

var _LeaderLineHelper = require("../dimensions/LeaderLineHelper");

var _LeaderLineHelper2 = _interopRequireDefault(_LeaderLineHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Helper for basic notes (single point)
*/

var NoteVisual = (function (_AnnotationVisual) {
  _inherits(NoteVisual, _AnnotationVisual);

  function NoteVisual(options) {
    _classCallCheck(this, NoteVisual);

    var DEFAULTS = {
      crossColor: "#000",
      text: "A"
    };

    options = Object.assign({}, DEFAULTS, options);

    //initialise internal sub objects

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NoteVisual).call(this, options));

    _this._setupVisuals();

    _this.point = options.point !== undefined ? options.point : undefined;
    _this.normal = options.normal !== undefined ? options.normal : undefined;
    _this.object = options.object !== undefined ? options.object : undefined;

    if (options.point) _this.setPoint(_this.point, _this.object);

    _this.setAsSelectionRoot(true);
    return _this;
  }

  _createClass(NoteVisual, [{
    key: "_setupVisuals",
    value: function _setupVisuals() {
      console.log("highlightColor", this.highlightColor, this.crossColor);
      this.pointCross = new _CrossHelper2.default({
        size: 1.5,
        lineWidth: this.lineWidth,
        color: this.crossColor,
        highlightColor: this.highlightColor
      });
      this.pointCross.hide();
      this.add(this.pointCross);

      //this.pointCube = new THREE.Mesh(new THREE.SphereGeometry(1,20,20), new THREE.MeshBasicMaterial({color:0xFF00FF}))
      //this.pointCube.hide()
      //this.add( this.pointCube )

      /*let material = new THREE.LineBasicMaterial({ color: 0x0000ff } )
      let circleGeometry = new THREE.CircleGeometry( 10, 64 )
      //circleGeometry.vertices.shift()      
      this.pointCircle = new THREE.Mesh( circleGeometry, material )
      this.add( this.pointCircle )*/

      this.lineMaterial = new _GizmoMaterial.GizmoLineMaterial({
        color: this.lineColor,
        lineWidth: this.lineWidth,
        polygonOffset: true,
        polygonOffsetFactor: -0.5,
        side: _three2.default.FrontSide,
        depthWrite: false,
        depthTest: false,

        highlightColor: this.highlightColor
      });
      this.pointCircle = new _CircleHelper2.default({
        material: this.lineMaterial,
        highlightColor: this.highlightColor });
      //this.pointCircle.hide()
      //this.pointCircle.setRadius(2.5)
      //this.add( this.pointCircle )

      this.leaderLine = new _LeaderLineHelper2.default({
        text: this.text,
        radius: 0,
        fontSize: this.fontSize,
        fontFace: this.fontFace,
        textColor: this.textColor,
        textBgColor: this.textBgColor,
        labelType: this.labelType,
        arrowColor: this.textColor,
        linesColor: this.lineColor,
        lineWidth: this.lineWidth,
        highlightColor: this.highlightColor,

        textBorder: "rectangle"
      });

      this.leaderLine.hide();
      this.add(this.leaderLine);
    }
  }, {
    key: "unset",
    value: function unset() {
      this.pointCross.hide();
      //this.pointCircle.hide()
    }
  }, {
    key: "setPoint",
    value: function setPoint(point, object) {
      if (point) this.point = point;
      if (object) this.object = object;

      //point location cross
      this.pointCross.position.copy(this.point);
      this.pointCross.show();

      //this.pointCube.position.copy( this.point )
      //this.pointCircle.position.copy(this.point)
      //this.pointCircle.show()

      this.leaderLine.position.copy(this.point);
      this.leaderLine.show();
    }
  }]);

  return NoteVisual;
})(_AnnotationVisual3.default);

exports.default = NoteVisual;