"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _BaseHelper2 = require("../BaseHelper");

var _BaseHelper3 = _interopRequireDefault(_BaseHelper2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Base helper for all annotations
*/

var AnnotationVisual = (function (_BaseHelper) {
  _inherits(AnnotationVisual, _BaseHelper);

  function AnnotationVisual(options) {
    _classCallCheck(this, AnnotationVisual);

    var DEFAULTS = {
      name: "",
      drawArrows: true,
      drawLeftArrow: true,
      drawRightArrow: true,
      arrowColor: "000",
      arrowsPlacement: 'dynamic', //can be either, dynamic, inside, outside
      arrowHeadSize: 2.0,
      arrowHeadWidth: 0.8,

      lineWidth: 1,
      drawSideLines: true,
      sideLength: 0,
      sideLengthExtra: 2, //how much sidelines should stick out
      sideLineColor: "000",
      sideLineSide: "front",

      drawLabel: true,
      labelPos: "center",
      labelType: "flat", //frontFacing or flat
      fontSize: 10,
      fontFace: "Jura",
      textColor: "#000",
      textBgColor: null,
      lengthAsLabel: true, //TODO: "length is too specific change that"
      textPrefix: "", //TODO: perhas a "textformat method would be better ??

      highlightColor: "#F00"
    };

    //TODO: how to deal with lineWidth would require not using simple lines but strips
    //see ANGLE issue on windows platforms

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AnnotationVisual).call(this, options));

    Object.assign(_this, options);

    /*this would be practical for "human referencing": ie
    for example "front mount hole" for a given measurement etc
    should name uniqueness be enforced ? yes, makes sense!
    */
    //this.name = "";

    //can this object be translated/rotated/scaled on its own ? NOPE
    _this.transformable = false;
    return _this;
  }

  return AnnotationVisual;
})(_BaseHelper3.default);

exports.default = AnnotationVisual;