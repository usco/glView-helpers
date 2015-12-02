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

var _SizeHelper = require("../dimensions/SizeHelper");

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _LeaderLineHelper = require("../dimensions/LeaderLineHelper");

var _LeaderLineHelper2 = _interopRequireDefault(_LeaderLineHelper);

var _GizmoMaterial = require("../GizmoMaterial");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Helper to measure ... diameters
  
  Two step interactive version : 
    - place center
    - place diameter
*/

var DiameterVisual = (function (_AnnotationVisual) {
  _inherits(DiameterVisual, _AnnotationVisual);

  function DiameterVisual(options) {
    _classCallCheck(this, DiameterVisual);

    var DEFAULTS = {
      diameter: 10,
      _position: new _three2.default.Vector3(),
      orientation: new _three2.default.Vector3(),
      textColor: "#ff0077",
      centerColor: "#F00",
      crossColor: "#F00",

      tolerance: 0 };

    //FIXME: this needs to be in all of the numerical measurement or not ?
    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DiameterVisual).call(this, options));

    _this.text = options.text !== undefined ? options.text : _this.diameter.toFixed(2);

    //FIXME: hack
    /*this.textColor = "#ff0077"
    this.arrowColor = this.textColor
    this.centerColor = this.textColor
    this.crossColor  = this.textColor
    this.textBgColor = "rgba(255, 255, 255, 0)"*/

    _this.lineMaterial = new _GizmoMaterial.GizmoLineMaterial({
      color: _this.lineColor,
      lineWidth: _this.lineWidth,
      polygonOffset: true,
      polygonOffsetFactor: -0.5,
      side: _three2.default.FrontSide,
      depthWrite: false,
      depthTest: false,

      highlightColor: _this.highlightColor
    });
    //depthTest:false, depthWrite:false,renderDepth : 1e20

    _this.dimDisplayType = options.dimDisplayType !== undefined ? options.dimDisplayType : "offsetLine";
    _this.centerCrossSize = 1.5;

    _this.center = undefined;
    _this.object = undefined;
    _this.pointA = undefined;
    _this.pointB = undefined;
    _this.pointC = undefined;

    _this._setupVisuals();
    _this.setAsSelectionRoot(true);

    if (options.center) _this.setCenter(options.center);
    if (options.diameter) _this.setDiameter(options.diameter);
    if (options.orientation) _this.setOrientation(options.orientation);

    return _this;
  }

  _createClass(DiameterVisual, [{
    key: "set",
    value: function set() {
      this.setCenter();
      this.setDiameter();
    }
  }, {
    key: "unset",
    value: function unset() {

      this.centerCross.hide();
      this.pointACross.hide();
      this.pointBCross.hide();
      this.pointCCross.hide();

      //this.sizeArrow.hide()
      this.leaderLine.hide();

      this.diaCircle.hide();

      this.position.copy(new _three2.default.Vector3());
      this.setOrientation(new _three2.default.Vector3(0, 0, 1));
    }

    /*configure all the basic visuals of this helper*/

  }, {
    key: "_setupVisuals",
    value: function _setupVisuals() {
      //initialise internal sub objects
      this.centerCross = new _CrossHelper2.default({
        size: this.centerCrossSize,
        color: this.crossColor,
        highlightColor: this.highlightColor });
      this.centerCross.hide();
      this.add(this.centerCross);

      this.diaCircle = new _CircleHelper2.default({
        material: this.lineMaterial,
        highlightColor: this.highlightColor });
      this.diaCircle.hide();
      this.add(this.diaCircle);

      /*//pointA cross
      this.pointACross = new CrossHelper({size:this.centerCrossSize,color:this.crossColor})
      this.pointACross.hide()
      this.add( this.pointACross )
       
      //pointB cross
      this.pointBCross = new CrossHelper({size:this.centerCrossSize,color:this.crossColor})
      this.pointBCross.hide()
      this.add( this.pointBCross )
           //pointC cross
      this.pointCCross = new CrossHelper({size:this.centerCrossSize,color:this.crossColor})
      this.pointCCross.hide()
      this.add( this.pointCCross )*/

      /*this.sizeArrow = new SizeHelper({
      fontSize: this.fontSize,
      textColor: this.textColor, textBgColor:this.textBgColor, labelType:this.labelType,
      arrowColor:this.textColor, 
      sideLineColor:this.textColor,
      textPrefix:"∅ ",
      })
      this.sizeArrow.hide()
      this.add( this.sizeArrow )*/

      //TODO: add settable swtich between size helper & leader line
      //leader line

      //let text = this.text
      var text = this.tolerance === 0 ? this.text : this.text + "±" + this.tolerance;
      //text:"∅"+this.text+"±0.15"

      this.leaderLine = new _LeaderLineHelper2.default({
        text: text,
        radius: this.diameter / 2,
        fontSize: this.fontSize,
        fontFace: this.fontFace,
        textColor: this.textColor,
        textBgColor: this.textBgColor,
        labelType: this.labelType,
        arrowColor: this.textColor,
        linesColor: this.lineColor,
        lineWidth: this.lineWidth,
        highlightColor: this.highlightColor
      });

      this.leaderLine.hide();
      this.add(this.leaderLine);
    }
  }, {
    key: "setCenter",
    value: function setCenter(center, object) {
      if (center) this.position.copy(center);
      if (center) this.center = center;
      if (object) this.object = object;

      this.centerCross.show();
      //FIXME: only needed if we do not offset this whole helper for positioning on the diam
      //this.centerCross.position.copy( this.center )
    }

    //for 3 point letiant

  }, {
    key: "setPointA",
    value: function setPointA(pointA, object) {
      if (pointA) this.pointA = pointA;
      this.object = object;
      this.pointACross.position.copy(pointA);
      this.pointACross.show();
    }
  }, {
    key: "setPointB",
    value: function setPointB(pointB, object) {
      if (pointB) this.pointB = pointB;
      this.object = object;
      this.pointBCross.position.copy(pointB);
      this.pointBCross.show();
    }
  }, {
    key: "setPointC",
    value: function setPointC(pointC, object) {
      if (pointC) this.pointC = pointC;
      this.object = object;
      this.pointCCross.position.copy(pointC);
      this.pointCCross.show();

      this.setDataFromThreePoints();
    }
  }, {
    key: "setDiameter",
    value: function setDiameter(diameter) {
      if (!diameter && !this.diameter) {
        return;
      }
      this.diameter = diameter;
      this.text = this.diameter.toFixed(2);

      //this.sizeArrow.setLength( this.diameter )
      //this.sizeArrow.setSideLength( this.diameter/2+10 )

      this.diaCircle.setRadius(this.diameter / 2);

      //this.sizeArrow.show()
      this.leaderLine.show();
      this.diaCircle.show();
    }
  }, {
    key: "setRadius",
    value: function setRadius(radius) {
      if (!radius && !this.diameter) {
        return;
      }
      this.setDiameter(radius * 2);
    }

    /*Sets the radius/diameter from one 3d point
    */

  }, {
    key: "setRadiusPoint",
    value: function setRadiusPoint(point, normal) {
      var radius = point.clone().sub(this.position).length();
      this.setDiameter(radius * 2);
    }

    //compute center , dia/radius from three 3d points

  }, {
    key: "setDataFromThreePoints",
    value: (function (_setDataFromThreePoints) {
      function setDataFromThreePoints() {
        return _setDataFromThreePoints.apply(this, arguments);
      }

      setDataFromThreePoints.toString = function () {
        return _setDataFromThreePoints.toString();
      };

      return setDataFromThreePoints;
    })(function () {
      throw new Error("do not use");

      var _setDataFromThreePoin = setDataFromThreePoints(this.pointA, this.pointB, this.pointC);

      var center = _setDataFromThreePoin.center;
      var diameter = _setDataFromThreePoin.diameter;
      var normal = _setDataFromThreePoin.normal;

      this.setOrientation(plane.normal);
      this.setCenter(center);
      this.setRadius(radius);

      this.pointACross.position.copy(this.pointA.clone().sub(this.position));
      this.pointBCross.position.copy(this.pointB.clone().sub(this.position));
      this.pointCCross.position.copy(this.pointC.clone().sub(this.position));
    })
  }, {
    key: "setOrientation",
    value: function setOrientation(orientation) {
      this.orientation = orientation;
      //console.log("this.orientation",this.orientation)

      var defaultOrientation = new _three2.default.Vector3(0, 0, 1);
      var quaternion = new _three2.default.Quaternion();
      quaternion.setFromUnitVectors(defaultOrientation, this.orientation.clone());
      this.rotation.setFromQuaternion(quaternion);
    }
  }]);

  return DiameterVisual;
})(_AnnotationVisual3.default);

exports.default = DiameterVisual;