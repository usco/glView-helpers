"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _BaseHelper2 = require("../BaseHelper");

var _BaseHelper3 = _interopRequireDefault(_BaseHelper2);

var _LineHelper = require("../LineHelper");

var _LineHelper2 = _interopRequireDefault(_LineHelper);

var _CrossHelper = require("../CrossHelper");

var _CrossHelper2 = _interopRequireDefault(_CrossHelper);

var _LabelHelper = require("../LabelHelper");

var _GizmoMaterial = require("../GizmoMaterial");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
  Made of two main arrows, and two lines perpendicular to the main arrow, at both its ends
  If the VISUAL distance between start & end of the helper is too short to fit text + arrow:
   * arrows should be on the outside
   * if text does not fit either, offset it to the side
*/

//TODO: how to put items on the left instead of right, front instead of back etc

var SizeHelper = (function (_BaseHelper) {
  _inherits(SizeHelper, _BaseHelper);

  function SizeHelper(options) {
    _classCallCheck(this, SizeHelper);

    var DEFAULTS = {
      _position: new _three2.default.Vector3(),
      centerColor: "#F00",
      crossColor: "#F00",
      highlightColor: "F00",

      drawArrows: true,
      drawLeftArrow: true,
      drawRightArrow: true,
      arrowColor: "000",
      arrowsPlacement: 'dynamic', //can be either, dynamic, inside, outside
      arrowHeadSize: 2.0,
      arrowHeadWidth: 0.8,
      arrowFlatten: 0.3, //by how much to flatten arrows along their "up axis"

      lineWidth: 1, //TODO: how to ? would require not using simple lines but strips
      //see ANGLE issue on windows platforms
      drawSideLines: true,
      sideLength: 0, //length of the small lines perpendicular to the main arrows
      sideLengthExtra: 2, //how much sidelines should stick out
      sideLineColor: "000",
      sideLineSide: "front",

      drawLabel: true,
      labelPos: "center",
      labelType: "flat", //frontFacing or flat
      labelSpacingExtra: 0.1,
      fontSize: 10,
      fontFace: "Jura",
      fontWeight: "bold",
      fontStyle: "",
      textColor: "#000",
      textBgColor: "rgba(255, 255, 255, 0)",
      lengthAsLabel: true, //TODO: "length is too specific change that"
      text: "",
      textPrefix: "", //TODO: perhas a "textformat method would be better ??

      start: undefined,
      end: undefined,
      up: new _three2.default.Vector3(0, 0, 1),
      direction: undefined, //new THREE.Vector3(1,0,0),
      facingSide: new _three2.default.Vector3(0, 1, 0), //all placement computations are done relative to this one
      facingMode: "static", //can be static or dynamic
      length: 0
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SizeHelper).call(this, options));

    _this.DEFAULTS = DEFAULTS; //keep defaults

    Object.assign(_this, options);

    console.log("options", options);

    //FIXME: do this better
    _this.axisAligned = false;
    _this.findGoodSide = true;

    _this.leftArrowPos = new _three2.default.Vector3();
    _this.rightArrowPos = new _three2.default.Vector3();
    _this.leftArrowDir = new _three2.default.Vector3();
    _this.rightArrowDir = new _three2.default.Vector3();
    _this.flatNormal = new _three2.default.Vector3(0, 0, 1);
    _this.labelPosition = new _three2.default.Vector3();
    _this.offsetLeftArrowPos = new _three2.default.Vector3();
    _this.offsetRightArrowPos = new _three2.default.Vector3();

    _this._setupVisuals();
    _this._computeBasics();

    return _this;
  }

  /* method compute all the minimal parameters, to have a minimal viable
  display of size
   parameter's priortity is in descending order as follows:
    - start & end
    - lengh & direction
   you can provide either:
    - start & end
    - start & length & direction
    - end & length & direction
  */

  _createClass(SizeHelper, [{
    key: "_computeBasics",
    value: function _computeBasics() {
      //either use provided length parameter , or compute things based on start/end parameters
      var start = this.start;
      var end = this.end;

      if (end && start) {
        var tmpV = end.clone().sub(start);
        this.length = tmpV.length();
        this.direction = tmpV.normalize();
      } else if (start && !end && this.direction && this.length) {
        end = this.direction.clone().multiplyScalar(this.length).add(start);
      } else if (end && !start && this.direction && this.length) {
        start = this.direction.clone().negate().multiplyScalar(this.length).add(end);
      } else if (this.direction && this.length) {
        start = this.direction.clone().multiplyScalar(-this.length / 2).add(this.position);
        end = this.direction.clone().multiplyScalar(this.length / 2).add(this.position);
      } else {
        //throw new Error("No sufficient parameters provided to generate a SizeHelper")
        return;
      }

      this.start = start;
      this.end = end;
      //MID is literally the middle point between start & end, nothing more
      this.mid = this.direction.clone().multiplyScalar(this.length / 2).add(this.start);

      //the size of arrows (if they are drawn) is max half the total length between start & end
      this.arrowSize = this.length / 2;
      this.leftArrowDir = this.direction.clone();
      this.rightArrowDir = this.direction.clone().negate();

      if (this.lengthAsLabel) this.text = this.length.toFixed(2);

      //HACK, for testing
      if (Math.abs(this.direction.z) - 1 <= 0.0001 && this.direction.x == 0 && this.direction.y == 0) {
        this.up = new _three2.default.Vector3(1, 0, 0);
      }

      var cross = this.direction.clone().cross(this.up);
      cross.normalize().multiplyScalar(this.sideLength);
      console.log("mid", this.mid, "cross", cross);

      /*let bla = [0,0,0]
      let axes = ["x","y","z"]
      axes.forEach( (axis, index) => {
        if(this.facingSide[axis] != 0)
        {
          bla[index] = cross[axis] * this.facingSide[axis]
        }
        else{
          bla[index] = cross[axis]
        }
      })
      cross = new THREE.Vector3().fromArray( bla )
      console.log("cross", cross)*/

      this.leftArrowPos = this.mid.clone().add(cross);
      this.rightArrowPos = this.mid.clone().add(cross);
      this.flatNormal = cross.clone();

      this.offsetMid = this.mid.clone().add(cross.clone().setLength(this.sideLength));
      this.offsetStart = this.start.clone().add(cross.clone().setLength(this.sideLength));
      this.offsetEnd = this.end.clone().add(cross.clone().setLength(this.sideLength));

      //compute all the arrow & label positioning details
      this._computeLabelAndArrowsOffsets();
      //all the basic are computed, configure visuals
      this._updateVisuals();
    }

    /* compute the placement for label & arrows
      determine positioning for the label/text:
      Different cases:
       - arrows pointing inwards:
        * if label + arrows fits between ends, put label between arrows
        * if label does not fit between ends
    */

  }, {
    key: "_computeLabelAndArrowsOffsets",
    value: function _computeLabelAndArrowsOffsets() {
      var sideLength = this.sideLength;
      var length = this.length;
      var labelPos = this.labelPos;
      var labelOrient = new _three2.default.Vector3(-1, 0, 1);
      var labelHeight = 0;
      var labelLength = 0;
      var innerLength = 0;
      var innerLengthHalf = 0;
      var labelSpacingExtra = this.labelSpacingExtra;
      var arrowHeadSize = this.arrowHeadSize;
      var arrowHeadsLength = this.arrowHeadSize * 2;
      var arrowSize = this.arrowSize;

      var offsetMid = this.offsetMid;
      var offsetStart = this.offsetStart;
      var offsetEnd = this.offsetEnd;

      //generate invisible label/ text
      //this first one is used to get some labeling metrics, and is
      //not always displayed
      var label = new _LabelHelper.LabelHelperPlane({
        text: this.text,
        fontSize: this.fontSize,
        fontWeight: this.fontWeight,
        fontFace: this.fontFace,
        color: this.textColor,
        bgColor: this.textBgColor });
      label.position.copy(this.leftArrowPos);

      //calculate offset so that there is a hole between the two arrows to draw the label
      if (this.drawLabel) {
        labelLength = label.textWidth + labelSpacingExtra * 2;
        labelHeight = label.textHeight;
      }

      innerLength = labelLength + arrowHeadsLength;
      innerLengthHalf = innerLength / 2;

      /*cases
        - no label : just arrows: 
          - arrows get placed OUTSIDE if size too small (dynamic & inside too)
        - label: 
          - label + labelBorder  + arrowHeads X2 need to fit between start & end
          - dynamic :
            * (labelLength + labelBorder  + arrowHeads X2) < length : do nothing  IE : length - (labelLength + labelBorder) > (arrowHeads X2)
            * (labelLength + labelBorder) < length but not arrows IE  0 < ( length - (labelLength + labelBorder)) < (arrowHeads X2)
            
      */
      var remLength = length - labelLength; //remaining length (total - label )
      var roomForBoth = remLength > arrowHeadsLength; //fiting arrow + label is OK
      var roomForLabel = remLength > 0 && remLength < arrowHeadsLength; //fitting only label is OK
      var noRoom = remLength < 0; // no room (in hell) to fit either label or arrows

      var actualPos = undefined; //we collapse all possibilities to something simple

      if (this.arrowsPlacement == "dynamic" || this.arrowsPlacement == "inner") {
        if (roomForBoth) //if the label + arrows would fit
          {
            this.arrowSize -= labelLength;
            this.leftArrowPos.add(this.leftArrowDir.clone().normalize().setLength(labelLength / 2));
            this.rightArrowPos.add(this.rightArrowDir.clone().normalize().setLength(labelLength / 2));
          }
        if (noRoom || roomForLabel) {

          this.arrowSize = Math.max(length / 2, 6); //we want arrows to be more than just arrowhead when we put it "outside"
          var arrowDist = length / 2 + this.arrowSize;

          //invert the direction of arrows , since we want them "OUTSIDE" of the start & end pointing "IN"
          this.leftArrowDir = this.direction.clone().negate();
          this.rightArrowDir = this.leftArrowDir.clone().negate();

          this.leftArrowPos.sub(this.leftArrowDir.clone().normalize().multiplyScalar(arrowDist));
          this.rightArrowPos.sub(this.rightArrowDir.clone().normalize().multiplyScalar(arrowDist));
        }
      } else if (this.arrowsPlacement == "outside") {
        //put the arrows outside of measure, pointing "inwards" towards center
        this.arrowSize = Math.max(length / 2, 6); //we want arrows to be more than just arrowhead in all the cases
        var arrowDist = this.length / 2 + this.arrowSize;

        this.leftArrowDir = this.direction.clone().negate();
        this.rightArrowDir = this.leftArrowDir.clone().negate();

        this.leftArrowPos.sub(this.leftArrowDir.clone().normalize().multiplyScalar(arrowDist));
        this.rightArrowPos.sub(this.rightArrowDir.clone().normalize().multiplyScalar(arrowDist));

        if (!roomForLabel) {
          //this.offsetMid   = this.mid.clone().add( cross.clone().multiplyScalar( this.sideLength ) )
          //this.offsetStart = this.start.clone().add( cross.clone().multiplyScalar( this.sideLength ) )
          //this.offsetEnd   = this.end.clone().add( cross.clone().multiplyScalar( this.sideLength ) )
          //console.log("UH OH , this", this, "will not fit!!")
          //we want it "to the side" , aligned with the arrow, beyond the arrow head
          //let lengthOffset = this.length/2 + labelSpacingExtra + arrowHeadSize + labelLength
          var lengthOffset = label.textWidth / 4 + arrowHeadSize;
          this.labelPosition = offsetStart.clone().add(this.leftArrowDir.clone().setLength(lengthOffset));
          labelPos = "top";
        }
      } else {
        var labelHoleHalfSize = labelLength / 2;
        this.arrowSize -= labelHoleHalfSize;
        this.leftArrowPos.add(this.leftArrowDir.clone().normalize().setLength(labelHoleHalfSize));
        this.rightArrowPos.add(this.rightArrowDir.clone().normalize().setLength(labelHoleHalfSize));
      }

      //offset the label based on centered/top/bottom setting
      switch (labelPos) {
        case "center":
          this.textHeightOffset = new _three2.default.Vector3();
          break;
        case "top":
          this.textHeightOffset = new _three2.default.Vector3().crossVectors(this.up, this.direction).setLength(labelHeight / 2);
          break;
        case "bottom":
          this.textHeightOffset = new _three2.default.Vector3().crossVectors(this.up, this.direction).setLength(labelHeight).negate();
          break;
      }
    }
  }, {
    key: "_setupVisuals",
    value: function _setupVisuals() {
      //materials
      this.arrowLineMaterial = new _GizmoMaterial.GizmoLineMaterial({
        highlightColor: this.highlightColor,
        color: this.arrowColor,
        linewidth: this.lineWidth,
        linecap: "miter" });
      this.arrowConeMaterial = new _GizmoMaterial.GizmoMaterial({
        color: this.arrowColor,
        highlightColor: this.highlightColor
      });

      //arrows
      var sideLength = this.sideLength;
      var leftArrowDir = undefined,
          rightArrowDir = undefined,
          leftArrowPos = undefined,
          rightArrowPos = undefined,
          arrowHeadSize = undefined,
          arrowSize = undefined,
          leftArrowHeadSize = undefined,
          leftArrowHeadWidth = undefined,
          rightArrowHeadSize = undefined,
          rightArrowHeadWidth = undefined;

      leftArrowDir = this.leftArrowDir;
      rightArrowDir = this.rightArrowDir;
      leftArrowPos = this.leftArrowPos;
      rightArrowPos = this.rightArrowPos;

      arrowHeadSize = this.arrowHeadSize;
      arrowSize = this.arrowSize;

      leftArrowHeadSize = rightArrowHeadSize = this.arrowHeadSize;
      leftArrowHeadWidth = rightArrowHeadWidth = this.arrowHeadWidth;

      //direction, origin, length, color, headLength, headRadius, headColor
      this.mainArrowLeft = new _three2.default.ArrowHelper(leftArrowDir, leftArrowPos, arrowSize, this.arrowColor, leftArrowHeadSize, leftArrowHeadWidth);
      this.mainArrowRight = new _three2.default.ArrowHelper(rightArrowDir, rightArrowPos, arrowSize, this.arrowColor, rightArrowHeadSize, rightArrowHeadWidth);

      if (!this.drawLeftArrow) this.mainArrowLeft.cone.visible = false;
      if (!this.drawRightArrow) this.mainArrowRight.cone.visible = false;

      this.mainArrowLeft.line.material = this.arrowLineMaterial;
      this.mainArrowRight.line.material = this.arrowLineMaterial;

      this.mainArrowLeft.cone.material = this.arrowConeMaterial;
      this.mainArrowRight.cone.material = this.arrowConeMaterial;

      //Flaten in the UP direction(s) , not just z
      var arrowFlatten = this.arrowFlatten;
      var arrowFlatScale = new _three2.default.Vector3(arrowFlatten, arrowFlatten, arrowFlatten);
      arrowFlatScale = new _three2.default.Vector3().multiplyVectors(this.up, arrowFlatScale);
      var axes = ["x", "y", "z"];
      axes.forEach(function (axis, index) {
        if (arrowFlatScale[axis] === 0) arrowFlatScale[axis] = 1;
      });
      this.mainArrowLeft.scale.copy(arrowFlatScale);
      this.mainArrowRight.scale.copy(arrowFlatScale);

      this.add(this.mainArrowLeft);
      this.add(this.mainArrowRight);
      //this.add( this.dirDebugArrow )

      this.mainArrowRight.renderDepth = this.mainArrowLeft.renderDepth = 1e20;
      this.mainArrowRight.depthTest = this.mainArrowLeft.depthTest = false;
      this.mainArrowRight.depthWrite = this.mainArrowLeft.depthWrite = false;
      //this.dirDebugArrow.depthWrite  = this.dirDebugArrow.depthTest = false

      ////////sidelines
      this.leftSideLine = new _LineHelper2.default({
        lineWidth: this.lineWidth / 1.5,
        color: this.arrowColor,
        highlightColor: this.highlightColor
      });
      this.rightSideLine = new _LineHelper2.default({
        lineWidth: this.lineWidth / 1.5,
        color: this.arrowColor,
        highlightColor: this.highlightColor
      });

      this.add(this.rightSideLine);
      this.add(this.leftSideLine);

      ////////labels
      switch (this.labelType) {
        case "flat":
          this.label = new _LabelHelper.LabelHelperPlane({
            text: this.text,
            fontSize: this.fontSize,
            fontFace: this.fontFace,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
            color: this.textColor,
            background: this.textBgColor != null,
            bgColor: this.textBgColor,
            highlightColor: this.highlightColor
          });
          break;
        case "frontFacing":
          this.label = new _LabelHelper.LabelHelper3d({
            text: this.text,
            fontSize: this.fontSize,
            fontFace: this.fontFace,
            fontWeight: this.fontWeight,
            fontStyle: this.fontStyle,
            color: this.textColor,
            bgColor: this.textBgColor,
            highlightColor: this.highlightColor
          });
          break;
      }
      this.label.position.copy(this.labelPosition);
      this.add(this.label);

      if (!this.drawLabel) {
        this.label.hide();
      } else {
        this.label.show();
      }

      //debug helpers
      this.debugHelpers = new _BaseHelper3.default();

      this.directionDebugHelper = new _three2.default.ArrowHelper(new _three2.default.Vector3(1, 0, 0), new _three2.default.Vector3(), 15, 0XFF0000);
      this.upVectorDebugHelper = new _three2.default.ArrowHelper(new _three2.default.Vector3(1, 0, 0), new _three2.default.Vector3(), 15, 0X0000FF);
      this.startDebugHelper = new _CrossHelper2.default({ color: 0xFF0000 });
      this.midDebugHelper = new _CrossHelper2.default({ color: 0x0000FF });
      this.endDebugHelper = new _CrossHelper2.default({ color: 0x00FF00 });

      this.offsetStartDebugHelper = new _CrossHelper2.default({ color: 0xFF0000 });
      this.offsetMidDebugHelper = new _CrossHelper2.default({ color: 0x0000FF });
      this.offsetEndDebugHelper = new _CrossHelper2.default({ color: 0x00FF00 });

      this.debugHelpers.add(this.directionDebugHelper);
      this.debugHelpers.add(this.upVectorDebugHelper);
      this.debugHelpers.add(this.startDebugHelper);
      this.debugHelpers.add(this.midDebugHelper);
      this.debugHelpers.add(this.endDebugHelper);
      this.debugHelpers.add(this.offsetStartDebugHelper);
      this.debugHelpers.add(this.offsetMidDebugHelper);
      this.debugHelpers.add(this.offsetEndDebugHelper);

      //this.add( this.debugHelpers )
      if (!this.debug) {
        this.debugHelpers.hide();
      } else {
        this.debugHelpers.show();
      }
    }
  }, {
    key: "_updateVisuals",
    value: function _updateVisuals() {
      var leftArrowDir = undefined,
          rightArrowDir = undefined,
          leftArrowPos = undefined,
          rightArrowPos = undefined,
          arrowHeadSize = undefined,
          arrowSize = undefined,
          leftArrowHeadSize = undefined,
          leftArrowHeadWidth = undefined,
          rightArrowHeadSize = undefined,
          rightArrowHeadWidth = undefined;

      leftArrowDir = this.leftArrowDir;
      rightArrowDir = this.rightArrowDir;
      leftArrowPos = this.leftArrowPos;
      rightArrowPos = this.rightArrowPos;

      arrowHeadSize = this.arrowHeadSize;
      arrowSize = this.arrowSize;

      this.mainArrowLeft.setLength(arrowSize, this.arrowHeadSize, this.arrowHeadWidth);
      this.mainArrowLeft.setDirection(leftArrowDir);
      this.mainArrowLeft.position.copy(leftArrowPos);

      this.mainArrowRight.setLength(arrowSize, this.arrowHeadSize, this.arrowHeadWidth);
      this.mainArrowRight.setDirection(rightArrowDir);
      this.mainArrowRight.position.copy(rightArrowPos);

      //Flaten arrows the UP direction(s)
      var arrowFlatten = this.arrowFlatten;
      var arrowFlatScale = new _three2.default.Vector3(arrowFlatten, arrowFlatten, arrowFlatten);
      arrowFlatScale = new _three2.default.Vector3().multiplyVectors(this.up, arrowFlatScale);
      var axes = ["x", "y", "z"];
      axes.forEach(function (axis, index) {
        if (arrowFlatScale[axis] === 0) arrowFlatScale[axis] = 1;
      });
      this.mainArrowLeft.scale.copy(arrowFlatScale);
      this.mainArrowRight.scale.copy(arrowFlatScale);

      ///sidelines
      var sideLength = this.sideLength;
      var sideLengthExtra = this.sideLengthExtra;

      var sideLineV = this.flatNormal.clone().setLength(sideLength + sideLengthExtra);

      var lSideLineStart = this.start.clone();
      var lSideLineEnd = lSideLineStart.clone().add(sideLineV);

      var rSideLineStart = this.end.clone();
      var rSideLineEnd = rSideLineStart.clone().add(sideLineV);
      //this.end.clone().sub( this.start )

      this.leftSideLine.setStart(lSideLineStart);
      this.leftSideLine.setEnd(lSideLineEnd);

      this.rightSideLine.setStart(rSideLineStart);
      this.rightSideLine.setEnd(rSideLineEnd);

      ///label
      if (!this.drawLabel) {
        this.label.hide();
      } else {
        this.label.show();
      }
      this.label.setText(this.text);
      this.label.position.copy(this.labelPosition.clone().add(this.textHeightOffset));

      //make the label face the correct way
      //flatNormal is a custom "up" vector (the way the label / arrows should face)

      //let labelDefaultOrientation = new THREE.Vector3(-1,0,1)
      //let quaternion = new THREE.Quaternion()
      //quaternion.setFromUnitVectors ( labelDefaultOrientation, this.direction.clone() )

      //from http://stackoverflow.com/questions/15139649/three-js-two-points-one-cylinder-align-issue
      var oldPos = this.label.position.clone();
      sideLength = this.sideLength;
      sideLineV = this.flatNormal.clone().setLength(sideLength);
      lSideLineStart = this.start.clone();
      lSideLineEnd = lSideLineStart.clone().add(sideLineV);
      rSideLineStart = this.end.clone();
      rSideLineEnd = rSideLineStart.clone().add(sideLineV);

      var orientation = new _three2.default.Matrix4(); //a new orientation matrix to offset pivot
      var offsetRotation = new _three2.default.Matrix4(); //a matrix to fix pivot rotation
      var offsetPosition = new _three2.default.Matrix4(); //a matrix to fix pivot position
      var up = this.up; //new THREE.Vector3(0,1,0)//this.up
      var HALF_PI = +Math.PI * .5;
      orientation.lookAt(lSideLineStart, lSideLineEnd, up); //look at destination
      offsetRotation.makeRotationX(HALF_PI); //rotate 90 degs on X
      orientation.multiply(offsetRotation); //combine orientation with rotation transformations

      var newOrient = new _three2.default.Euler().setFromRotationMatrix(orientation);

      function isEulerAlmostEqual(euler, otherEuler) {
        var precision = arguments.length <= 2 || arguments[2] === undefined ? 0.00001 : arguments[2];

        /*return (
        ( Math.abs( euler._x - otherEuler._x) < precision ) && 
        ( Math.abs( euler._y - otherEuler._y) < precision ) && 
        ( Math.abs( euler._z - otherEuler._z) < precision ) && 
        ( euler._order === otherEuler._order ) )
        ||
        (
         )*/
        return euler._x === otherEuler._x && euler._y === -otherEuler._y && euler._order === otherEuler._order;
      }
      //if( prev.equals( this.label.rotation ) )//issues with precision
      if (isEulerAlmostEqual(newOrient, this.label.rotation)) {
        console.log("already there bud");
      } else {
        this.label.applyMatrix(orientation);
        this.label.position.copy(oldPos);
        //this.label.position.copy( this.mid )
      }

      //FIXME: HACK
      if (this.facingSide.x == -1) {
        console.log("ughh");
        //offsetRotation.makeRotationZ( Math.PI )
        //this.label.rotateOnAxis( new THREE.Vector3(0,0,1), Math.PI )
      }

      //debug helpers
      this.directionDebugHelper.setDirection(this.direction);
      this.upVectorDebugHelper.setDirection(this.up);
      this.startDebugHelper.position.copy(this.start);
      this.midDebugHelper.position.copy(this.mid);
      this.endDebugHelper.position.copy(this.end);

      this.offsetStartDebugHelper.position.copy(this.offsetStart);
      this.offsetMidDebugHelper.position.copy(this.offsetMid);
      this.offsetEndDebugHelper.position.copy(this.offsetEnd);

      if (!this.debug) {
        this.debugHelpers.hide(); //not working ??
      } else {
          this.debugHelpers.show();
        }

      //FIXME: something weird is going on, we have to remove the debug helpers, cannot
      //hide them ??
      //this.remove( this.debugHelpers )
    }

    //setters
    /* set all parameters from options */

  }, {
    key: "setFromParams",
    value: function setFromParams(options) {
      var defaults = {
        start: undefined,
        end: undefined,
        up: new _three2.default.Vector3(0, 0, 1)
      };

      this.start = undefined;
      this.end = undefined;
      this.up = new _three2.default.Vector3(0, 0, 1);
      this.direction = undefined; //new THREE.Vector3(1,0,0),
      this.facingSide = new _three2.default.Vector3(0, 1, 0); //all placement computations are done relative to this one

      this.labelOriented = false;

      this.label.position.set(0, 0, 0);
      this.label.scale.set(1, 1, 1);
      this.label.rotation.set(0, 0, 0);
      this.label.updateMatrix();

      Object.assign(this, options);

      this._computeBasics();
    }
  }, {
    key: "setUp",
    value: function setUp(up) {
      this.up = up !== undefined ? up : new _three2.default.Vector3(0, 0, 1);
      this._computeBasics();
    }
  }, {
    key: "setDirection",
    value: function setDirection(direction) {
      this.direction = direction || new _three2.default.Vector3(1, 0, 0);
      this._computeBasics();
    }
  }, {
    key: "setLength",
    value: function setLength(length) {
      /*this.length = length !== undefined ? length : 10
      
      this.start = this.direction.clone().multiplyScalar( -this.length/2).add( this._position )
      this.end   = this.direction.clone().multiplyScalar( this.length/2).add( this._position )
          this._recomputeMidDir()  */
    }
  }, {
    key: "setSideLength",
    value: function setSideLength(sideLength) {
      this.sideLength = sideLength !== undefined ? sideLength : 0;
      this._computeBasics();
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this.text = text !== undefined ? text : "";
      this._computeBasics();
    }
  }, {
    key: "setStart",
    value: function setStart(start) {
      this.start = start || new _three2.default.Vector3();
      this._computeBasics();
    }
  }, {
    key: "setEnd",
    value: function setEnd(end) {
      this.end = end || new _three2.default.Vector3();
      this._computeBasics();
    }
  }, {
    key: "setFacingSide",
    value: function setFacingSide(facingSide) {
      this.facingSide = facingSide || new _three2.default.Vector3();
      this._computeBasics();
    }
  }]);

  return SizeHelper;
})(_BaseHelper3.default);

exports.default = SizeHelper;