'use strict';

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _BaseHelper2 = require('../BaseHelper');

var _BaseHelper3 = _interopRequireDefault(_BaseHelper2);

var _CrossHelper = require('../CrossHelper');

var _CrossHelper2 = _interopRequireDefault(_CrossHelper);

var _ArrowHelper = require('../ArrowHelper2');

var _ArrowHelper2 = _interopRequireDefault(_ArrowHelper);

var _LabelHelper = require('../LabelHelper');

var _GizmoMaterial = require('../GizmoMaterial');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Visual helper representing leader lines
*/

var LeaderLineHelper = (function (_BaseHelper) {
  _inherits(LeaderLineHelper, _BaseHelper);

  function LeaderLineHelper(options) {
    _classCallCheck(this, LeaderLineHelper);

    var DEFAULTS = {
      distance: 30,
      color: "#000",
      text: "",
      fontFace: "Jura"
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LeaderLineHelper).call(this, options));

    Object.assign(_this, options);

    _this.arrowColor = options.arrowColor !== undefined ? options.arrowColor : 0x000000;
    _this.arrowHeadSize = options.arrowHeadSize !== undefined ? options.arrowHeadSize : 2.0;
    _this.arrowHeadWidth = options.arrowHeadWidth !== undefined ? options.arrowHeadWidth : 0.8;
    _this.arrowHeadType = options.arrowHeadType !== undefined ? options.arrowHeadType : undefined;

    _this.linesColor = options.linesColor !== undefined ? options.linesColor : 0x000000;
    _this.lineWidth = options.lineWidth !== undefined ? options.lineWidth : 1;

    _this.fontSize = options.fontSize !== undefined ? options.fontSize : 8;
    _this.textColor = options.textColor !== undefined ? options.textColor : "#000";
    _this.textBgColor = options.textBgColor !== undefined ? options.textBgColor : "#fff";
    _this.labelType = options.labelType !== undefined ? options.labelType : "frontFacing";

    _this.angle = options.angle !== undefined ? options.angle : 45;
    _this.angleLength = options.angleLength !== undefined ? options.angleLength : 5;
    _this.horizLength = options.horizLength !== undefined ? options.horizLength : 5;
    _this.radius = options.radius !== undefined ? options.radius : 0;

    _this.highlightColor = options.highlightColor !== undefined ? options.highlightColor : "#F00";

    var angle = _this.angle;
    var radius = _this.radius;
    var angleLength = _this.angleLength;
    var horizLength = _this.horizLength;

    var textBorder = options.textBorder || null;
    var material = new _GizmoMaterial.GizmoLineMaterial({
      color: _this.linesColor,
      lineWidth: _this.lineWidth,
      linecap: "miter",
      highlightColor: _this.highlightColor
    });
    //depthTest:false,depthWrite:false})

    var rAngle = angle;
    rAngle = rAngle * Math.PI / 180;
    var y = Math.cos(rAngle) * angleLength;
    var x = Math.sin(rAngle) * angleLength;
    var angleEndPoint = new _three2.default.Vector3(x, y, 0);
    angleEndPoint = angleEndPoint.add(angleEndPoint.clone().normalize().multiplyScalar(radius));
    var angleArrowDir = angleEndPoint.clone().normalize();
    angleEndPoint.x = -angleEndPoint.x;
    angleEndPoint.y = -angleEndPoint.y;

    _this.angleArrow = new _ArrowHelper2.default(angleArrowDir, angleEndPoint, angleLength, _this.color, _this.arrowHeadSize, _this.arrowHeadWidth, _this.arrowHeadType);
    _this.angleArrow.scale.z = 0.6;

    var horizEndPoint = angleEndPoint.clone();
    horizEndPoint.x -= horizLength;

    var horizGeom = new _three2.default.Geometry();
    horizGeom.vertices.push(angleEndPoint);
    horizGeom.vertices.push(horizEndPoint);

    _this.horizLine = new _three2.default.Line(horizGeom, material);

    //draw dimention / text
    switch (_this.labelType) {
      case "flat":
        _this.label = new _LabelHelper.LabelHelperPlane({
          text: _this.text,
          fontSize: _this.fontSize,
          fontFace: _this.fontFace,
          background: _this.textBgColor != null,
          color: _this.textColor,
          bgColor: _this.textBgColor,
          highlightColor: _this.highlightColor
        });
        break;
      case "frontFacing":
        _this.label = new _LabelHelper.LabelHelper3d({
          text: _this.text,
          fontSize: _this.fontSize,
          fontFace: _this.fontFace,
          color: _this.textColor,
          bgColor: _this.textBgColor });
        break;
    }
    _this.label.rotation.z = Math.PI;
    var labelSize = _this.label.textWidth / 2 + 1; //label size, plus some extra
    var labelPosition = horizEndPoint.clone().sub(new _three2.default.Vector3(labelSize, 0, 0));
    _this.label.position.add(labelPosition);

    /*
    let precisionLabelPos = new THREE.Vector3().copy( labelPosition )
    precisionLabelPos.x += this.label.width
    
    //TODO: this is both needed in the data structures & in the visuals (here)
    this.precision = 0.12
    this.precisionText = "+"+this.precision+"\n"+"-"+this.precision
    this.precisionLabel = new LabelHelperPlane({text:this.precisionText,fontSize:this.fontSize/1.5,background:(this.textBgColor!=null),color:this.textColor,bgColor:this.textBgColor})
    this.add( this.precisionLabel )
    
    this.precisionLabel.rotation.z = Math.PI
    this.precisionLabel.position.copy( precisionLabelPos )*/

    /*let crossHelper = new CrossHelper({
        size:3
    })
    this.add( crossHelper )*/

    if (textBorder) {
      if (textBorder === "circle") {
        var textBorderGeom = new _three2.default.CircleGeometry(labelSize, 32);
        textBorderGeom.vertices.shift();
        var textBorderOutline = new _three2.default.Line(textBorderGeom, material);
        textBorderOutline.position.add(labelPosition);
        _this.add(textBorderOutline);
      }
      if (textBorder === "rectangle") {
        var rectWidth = _this.label.textHeight;
        var rectLength = _this.label.textWidth;

        //console.log("textWidth",this.label.textWidth, this.label.width,"textHeight",this.label.textHeight, this.label.height)

        var rectShape = new _three2.default.Shape();
        rectShape.moveTo(0, 0);
        rectShape.lineTo(0, rectWidth);
        rectShape.lineTo(rectLength, rectWidth);
        rectShape.lineTo(rectLength, 0);
        rectShape.lineTo(0, 0);
        rectShape.lineTo(0, 0);

        var textBorderGeom = new _three2.default.ShapeGeometry(rectShape);
        var textBorderOutline = new _three2.default.Line(textBorderGeom, material);
        textBorderOutline.position.add(labelPosition);
        textBorderOutline.position.add(new _three2.default.Vector3(-rectLength / 2, -rectWidth / 2, 0));
        _this.add(textBorderOutline);
      }
    }

    _this.add(_this.angleArrow);
    _this.add(_this.horizLine);
    _this.add(_this.label);

    //material settings
    _this.arrowLineMaterial = new _GizmoMaterial.GizmoLineMaterial({
      color: _this.arrowColor,
      lineWidth: _this.lineWidth,
      linecap: "miter",
      highlightColor: _this.highlightColor });
    _this.arrowConeMaterial = new _GizmoMaterial.GizmoMaterial({
      color: _this.arrowColor,
      highlightColor: _this.highlightColor
    });

    _this.angleArrow.line.material = _this.arrowLineMaterial;
    _this.angleArrow.head.material = _this.arrowConeMaterial;
    _this.angleArrow.line.material.depthTest = _this.angleArrow.line.material.depthTest = true;
    _this.angleArrow.line.material.depthWrite = _this.angleArrow.line.material.depthWrite = true;

    //this.angleArrow.renderDepth = 1e20
    _this.horizLine.renderDepth = 1e20;
    return _this;
  }

  return LeaderLineHelper;
})(_BaseHelper3.default);

module.exports = LeaderLineHelper;