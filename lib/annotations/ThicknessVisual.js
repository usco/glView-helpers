"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _AnnotationVisual2 = require("./AnnotationVisual");

var _AnnotationVisual3 = _interopRequireDefault(_AnnotationVisual2);

var _CrossHelper = require("../CrossHelper");

var _CrossHelper2 = _interopRequireDefault(_CrossHelper);

var _SizeHelper = require("../dimensions/SizeHelper");

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _BaseHelper = require("../BaseHelper");

var _BaseHelper2 = _interopRequireDefault(_BaseHelper);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ThicknessVisual = (function (_AnnotationVisual) {
  _inherits(ThicknessVisual, _AnnotationVisual);

  function ThicknessVisual(options) {
    _classCallCheck(this, ThicknessVisual);

    var DEFAULTS = {
      normalType: "face", //can be, face, x,y,z
      sideLength: 10,

      object: undefined,
      entryPoint: undefined,
      exitPoint: undefined,
      thickness: undefined
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ThicknessVisual).call(this, options));

    Object.assign(_this, options); //unsure

    _this.DEFAULTS = DEFAULTS;
    //initialise visuals
    _this._setupVisuals();
    _this._computeBasics();

    _this.setAsSelectionRoot(true);
    return _this;
  }

  _createClass(ThicknessVisual, [{
    key: "_computeBasics",
    value: function _computeBasics() {
      var entryPoint = this.entryPoint;
      var exitPoint = this.exitPoint;
      var object = this.object;

      if (!entryPoint || !exitPoint || !object) return;

      var endToStart = exitPoint.clone().sub(entryPoint);
      this.thickness = endToStart.length();

      var putSide = new _three2.default.Vector3();
      try {
        var midPoint = endToStart.divideScalar(2).add(entryPoint);
        putSide = (0, _utils.getTargetBoundsData)(object, midPoint);
      } catch (error) {
        console.error(error);
      }

      this.ThicknessVisualArrows.setFromParams({
        start: entryPoint,
        end: exitPoint,
        facingSide: putSide
      });
      this.ThicknessVisualArrows.show();
    }

    /*configure all the basic visuals of this helper*/

  }, {
    key: "_setupVisuals",
    value: function _setupVisuals() {
      this.ThicknessVisualArrows = new _SizeHelper2.default({
        lineWidth: this.lineWidth,
        textColor: this.textColor,
        textBgColor: this.textBgColor,
        fontSize: this.fontSize,
        fontFace: this.fontFace,
        labelType: "flat",
        arrowsPlacement: "outside",
        arrowColor: this.arrowColor,
        sideLength: this.sideLength,

        highlightColor: this.highlightColor
      });
      this.ThicknessVisualArrows.hide();
      this.add(this.ThicknessVisualArrows);

      //debug helpers
      this.faceNormalHelper = new _three2.default.ArrowHelper(new _three2.default.Vector3(), new _three2.default.Vector3(), 15, 0XFF0000);
      this.faceNormalHelper2 = new _three2.default.ArrowHelper(new _three2.default.Vector3(), new _three2.default.Vector3(), 15, 0X00FF00);
      this.entryPointHelper = new _CrossHelper2.default({ color: 0xFF0000 });
      this.exitPointHelper = new _CrossHelper2.default({ color: 0x00FF00 });

      this.debugHelpers = new _BaseHelper2.default();
      this.debugHelpers.add(this.faceNormalHelper);
      this.debugHelpers.add(this.faceNormalHelper2);
      this.debugHelpers.add(this.entryPointHelper);
      this.debugHelpers.add(this.exitPointHelper);

      //this.add( this.debugHelpers )

      if (!this.debug) {
        this.debugHelpers.hide();
      }
    }
  }, {
    key: "_updateVisuals",
    value: function _updateVisuals() {
      this.faceNormalHelper.setStart(this.entryPoint);
      this.faceNormalHelper.setDirection(this.exitPoint.clone().sub(this.entryPoint));

      this.faceNormalHelper2.setStart(this.exitPoint);
      this.faceNormalHelper2.setDirection(this.entryPoint.clone().sub(this.exitPoint));

      this.entryPointHelper.position.copy(this.entryPoint);
      this.exitPointHelper.position.copy(this.exitPoint);
    }
  }, {
    key: "setThickness",
    value: function setThickness(thickness) {
      this.thickness = thickness;
    }
  }, {
    key: "setEntryPoint",
    value: function setEntryPoint(entryPoint, object) {
      this.entryPoint = entryPoint;
      this.object = object;
    }
  }, {
    key: "setExitPoint",
    value: function setExitPoint(exitPoint) {
      this.exitPoint = exitPoint;
    }
  }, {
    key: "set",
    value: function set(entryInteresect) {
      var _getEntryAndExit = getEntryAndExit(entryInteresect, this.normalType);

      var object = _getEntryAndExit.object;
      var entryPoint = _getEntryAndExit.entryPoint;
      var exitPoint = _getEntryAndExit.exitPoint;
      var thickness = _getEntryAndExit.thickness;

      this.position.setFromMatrixPosition(object.matrixWorld);

      //set letious internal attributes
      this.setEntryPoint(entryPoint, object);
      this.exitPoint = exitPoint;
      try {
        var midPoint = endToStart.divideScalar(2).add(entryPoint);
        console.log("midPoint", entryPoint, midPoint, exitPoint);
        var _putSide = this.getTargetBoundsData(object, midPoint);
      } catch (error) {
        console.error(error);
      }
      this.ThicknessVisualArrows.setFromParams({
        start: entryPoint,
        end: exitPoint,
        facingSide: putSide
      });
      this.ThicknessVisualArrows.show();
    }
  }, {
    key: "unset",
    value: function unset() {
      //this.thickness = undefined
      this.position.set(0, 0, 0);
      var options = Object.assign({}, this.DEFAULTS, options);
      Object.assign(this, options); //unsure
      this.ThicknessVisualArrows.hide();
    }
  }]);

  return ThicknessVisual;
})(_AnnotationVisual3.default);

module.exports = ThicknessVisual;