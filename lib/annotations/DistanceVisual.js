"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _AnnotationVisual3 = require("./AnnotationVisual");

var _AnnotationVisual4 = _interopRequireDefault(_AnnotationVisual3);

var _SizeHelper = require("../dimensions/SizeHelper");

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

var _CrossHelper = require("../CrossHelper");

var _CrossHelper2 = _interopRequireDefault(_CrossHelper);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DistanceVisual = (function (_AnnotationVisual) {
  _inherits(DistanceVisual, _AnnotationVisual);

  function DistanceVisual(options) {
    _classCallCheck(this, DistanceVisual);

    var DEFAULTS = {
      crossSize: 3,
      crossColor: "#000",

      distance: undefined,
      start: undefined,
      startObject: undefined,
      end: undefined,
      endObject: undefined
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DistanceVisual).call(this, options));

    Object.assign(_this, options);

    //initialise internal sub objects
    _this._setupVisuals();
    _this._computeBasics();

    _this.setAsSelectionRoot(true);
    return _this;
  }

  /*configure all the basic visuals of this helper*/

  _createClass(DistanceVisual, [{
    key: "_setupVisuals",
    value: function _setupVisuals() {
      this.startCross = new _CrossHelper2.default({ size: this.crossSize, color: this.crossColor });
      this.startCross.hide();
      this.add(this.startCross);

      this.endCross = new _CrossHelper2.default({ size: this.crossSize, color: this.crossColor });
      this.endCross.hide();
      this.add(this.endCross);

      this.sizeArrow = new _SizeHelper2.default({
        lineWidth: this.lineWidth,
        textColor: this.textColor,
        textBgColor: this.textBgColor,
        fontSize: this.fontSize,
        fontFace: this.fontFace,
        labelType: this.labelType,
        arrowColor: this.arrowColor,
        sideLength: this.sideLength, //6
        sideLineColor: this.arrowColor,
        sideLineSide: "back" });

      this.sizeArrow.hide();
      this.add(this.sizeArrow);
    }
  }, {
    key: "_computeBasics",
    value: function _computeBasics() {
      var start = this.start;
      var end = this.end;
      var startObject = this.startObject;
      var endObject = this.endObject;

      if (!start || !end || !startObject || !endObject) return;

      var endToStart = end.clone().sub(start);
      this.distance = endToStart.length();

      try {
        var midPoint = endToStart.divideScalar(2).add(start);
        this._putSide = (0, _utils.getTargetBoundsData)(startObject, midPoint);
      } catch (error) {
        console.error(error);
      }

      //all done, now update the visuals
      this._updateVisuals();
    }
  }, {
    key: "_updateVisuals",
    value: function _updateVisuals() {
      console.log("this._putSide", this._putSide);
      this.sizeArrow.setFromParams({
        start: this.start,
        end: this.end,
        debug: true
        //facingSide:new THREE.Vector3(0,0,1)
        //facingSide:this._putSide,
      });

      this.sizeArrow.show();
      this.startCross.show();
      this.endCross.show();

      this.startCross.position.copy(this.start);
      this.endCross.position.copy(this.end);
    }

    /*start: vector3D
    object: optional : on which object is the start point
    */

  }, {
    key: "setStart",
    value: function setStart(start, object) {
      if (!start) return;
      this.start = start;
      if (object) this.startObject = object;
      object = this.startObject;
      //console.log("setting start",start, object, object.worldToLocal(start.clone()) )

      this.startCross.position.copy(this.start);
      this.sizeArrow.setStart(this.start);
    }
  }, {
    key: "setEnd",
    value: function setEnd(end, object) {
      if (!end) return;
      this.end = end;
      if (object) this.endObject = object;
      object = this.endObject;

      this.distance = end.clone().sub(this.start).length();

      this.endCross.position.copy(this.end);
      this.endCross.show();

      this.sizeArrow.setEnd(this.end);
      this.sizeArrow.show();
    }
  }, {
    key: "unset",
    value: function unset() {
      this.startCross.hide();
      this.sizeArrow.hide();

      this._endHook = null;
      this._startHook = null;
    }
  }]);

  return DistanceVisual;
})(_AnnotationVisual4.default);

var DistanceVisual__ = (function (_AnnotationVisual2) {
  _inherits(DistanceVisual__, _AnnotationVisual2);

  function DistanceVisual__(options) {
    _classCallCheck(this, DistanceVisual__);

    var DEFAULTS = {
      crossSize: 3,
      crossColor: "#000",

      distance: undefined,
      start: undefined,
      startObject: undefined,
      end: undefined,
      endObject: undefined
    };

    options = Object.assign({}, DEFAULTS, options);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DistanceVisual__).call(this, options));

    Object.assign(_this2, options);

    //initialise internal sub objects
    _this2._setupVisuals();
    _this2._computeBasics();

    _this2.updatable = false;
    _this2.setAsSelectionRoot(true);
    //FIXME: do this in a more coherent way
    _this2._setName();
    return _this2;
  }

  //getters & setters
  /*get start () {
    return this._start
  }
  set start (val) {
    console.log("setting start",val)
    let start = this._start = val
    this._computeStartHooks()
    
    if(!this.startCross ) return
    this.startCross.position.copy( this.start )
    this.startCross.show()
  }
  
  get startObject () {
    return this._startObject
  }
  set startObject (val) {
    console.log("setting start object",val)
    let startObject = this._startObject = val
    this._computeStartHooks()
  }
  
  get end() {
    return this._end
  }
  set end(val) {
    console.log("setting end",val)
    let start = this._end = val
    this._computeEndHooks()
  }
  
  get endObject () {
    return this._endObject
  }
  set endObject (val) {
    console.log("setting end object",val)
    let endObject = this._endObject = val
    this._computeEndHooks()
  }
   _computeStartHooks(){
  
    if(!this.start || !this.startObject) return
    this.curStartObjectPos = this.startObject.position.clone()
    
    this._startOffset = this.start.clone().sub( this.curStartObjectPos )
    if(!this._startHook){
      this._startHook = new THREE.Object3D()
      this._startHook.position.copy( this.start.clone().sub( this.startObject.position ) )//object.worldToLocal(this.start) )
      this.startObject.add( this._startHook )
    }
  }
  
  _computeEndHooks(){
    if(!this.end || !this.endObject) return
    
    //FIXME: experimental
    this.curEndObjectPos = this.endObject.position.clone()
     this._endOffset = this.end.clone().sub( this.curEndObjectPos )
    
    if(!this._endHook){
      this._endHook = new THREE.Object3D()
      this._endHook.position.copy( this.end.clone().sub( this.endObject.position ) )//object.worldToLocal(this.end) )
      this.endObject.add( this._endHook )
    }
    
    this._computeBasics()
  }*/

  _createClass(DistanceVisual__, [{
    key: "_computeBasics",
    value: function _computeBasics() {
      var start = this.start;
      var end = this.end;
      var startObject = this.startObject;
      var endObject = this.endObject;

      if (!start || !end || !startObject || !endObject) return;

      var endToStart = end.clone().sub(start);
      this.distance = endToStart.length();

      try {
        var midPoint = endToStart.divideScalar(2).add(start);
        this._putSide = this.getTargetBoundsData(startObject, midPoint);
      } catch (error) {
        console.error(error);
      }

      //all done, now update the visuals
      this._updateVisuals();

      this.sizeArrow.show();
      this.startCross.show();
    }

    /*configure all the basic visuals of this helper*/

  }, {
    key: "_setupVisuals",
    value: function _setupVisuals() {
      this.startCross = new _CrossHelper2.default({ size: this.crossSize, color: this.crossColor });
      this.startCross.hide();
      this.add(this.startCross);

      this.sizeArrow = new _SizeHelper2.default({
        textColor: this.textColor,
        textBgColor: this.textBgColor,
        fontSize: this.fontSize,
        fontFace: this.fontFace,
        labelType: this.labelType,
        arrowColor: this.arrowColor,
        sideLength: this.sideLength, //6
        sideLineColor: this.arrowColor,
        sideLineSide: "back" });

      this.sizeArrow.hide();
      this.add(this.sizeArrow);
    }
  }, {
    key: "_updateVisuals",
    value: function _updateVisuals() {
      this.sizeArrow.setFromParams({
        start: this.start,
        end: this.end,
        facingSide: this._putSide
      });

      this.startCross.position.copy(this.start);
    }

    /*start: vector3D
    object: optional : on which object is the start point
    */

  }, {
    key: "setStart",
    value: function setStart(start, object) {
      if (!start) return;
      this.start = start;
      if (object) this.startObject = object;
      object = this.startObject;
      //console.log("setting start",start, object, object.worldToLocal(start.clone()) )

      //FIXME: experimental
      this.curStartObjectPos = object.position.clone();

      this._startOffset = start.clone().sub(this.curStartObjectPos);
      if (!this._startHook) {
        this._startHook = new _three2.default.Object3D();
        this._startHook.position.copy(this.start.clone().sub(object.position)); //object.worldToLocal(this.start) )
        object.add(this._startHook);
      }

      this.startCross.position.copy(this.start);
      this.sizeArrow.setStart(this.start);
    }
  }, {
    key: "setEnd",
    value: function setEnd(end, object) {
      if (!end) return;
      this.end = end;
      if (object) this.endObject = object;

      object = this.endObject;

      //FIXME: experimental
      this.curEndObjectPos = object.position.clone();

      this._endOffset = end.clone().sub(this.curEndObjectPos);

      if (!this._endHook) {
        this._endHook = new _three2.default.Object3D();
        this._endHook.position.copy(this.end.clone().sub(object.position)); //object.worldToLocal(this.end) )
        object.add(this._endHook);
      }

      this.distance = end.clone().sub(this.start).length();

      this.sizeArrow.setEnd(this.end);
      this.sizeArrow.show();
    }
  }, {
    key: "unset",
    value: function unset() {
      this.startCross.hide();
      this.sizeArrow.hide();

      this._endHook = null;
      this._startHook = null;
    }
  }]);

  return DistanceVisual__;
})(_AnnotationVisual4.default);

exports.default = DistanceVisual;

/*brute force update method, to update the star & end positions
when the objects they are attached to change (position, rotation,scale)
update( ){
  return
  //TODO: find a way to only call this when needed
  if(!this.visible) return
  if(!this.updatable) return
  let changed = false
  
  this.startObject.updateMatrix()
  this.startObject.updateMatrixWorld()
  this.endObject.updateMatrix()
  this.endObject.updateMatrixWorld()
  
  this.setStart( this.startObject.localToWorld( this._startHook.position.clone() ) )
  this.setEnd( this.endObject.localToWorld( this._endHook.position.clone()) )
  
  this._setName()
}*/