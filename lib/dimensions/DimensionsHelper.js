"use strict";

var _BaseOutline = require("./BaseOutline");

var _BaseOutline2 = _interopRequireDefault(_BaseOutline);

var _BaseHelper = require("../BaseHelper");

var _BaseHelper2 = _interopRequireDefault(_BaseHelper);

var _Box3C = require("../Box3C");

var _Box3C2 = _interopRequireDefault(_Box3C);

var _SizeHelper = require("./SizeHelper");

var _SizeHelper2 = _interopRequireDefault(_SizeHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ObjectDimensionsHelper(options) {
  _BaseHelper2.default.call(this);
  options = options || {};
  var color = this.color = options.color || 0x000000;
  mesh = options.mesh || this.parent || null;

  this.textBgColor = options.textBgColor !== undefined ? options.textBgColor : "#fff";
  this.textColor = options.textColor !== undefined ? options.textColor : "#000";
  this.labelType = options.labelType !== undefined ? options.labelType : "flat";
  this.sideLength = options.sideLength !== undefined ? options.sideLength : 10;

  this.textBgColor = "#f5f5f5"; //"rgba(255, 255, 255, 0)"
  this.textColor = "#ff0077"; //options.textBgColor;
}

ObjectDimensionsHelper.prototype = Object.create(_BaseHelper2.default.prototype);
ObjectDimensionsHelper.prototype.constructor = ObjectDimensionsHelper;

ObjectDimensionsHelper.prototype.attach = function (mesh) {
  var color = this.color;
  mesh = this.mesh = mesh;
  var lineMat = new THREE.MeshBasicMaterial({ color: color, wireframe: true, shading: THREE.FlatShading });
  /*mesh.updateMatrixWorld();
  let matrixWorld = new THREE.Vector3();
  matrixWorld.setFromMatrixPosition( mesh.matrixWorld );
  this.position.copy( matrixWorld );*/

  var dims = this.getBounds(mesh);
  var length = this.length = dims[0];
  var width = this.width = dims[1];
  var height = this.height = dims[2];

  var delta = this.computeMiddlePoint(mesh);

  //console.log("w",width,"l",length,"h",height,delta);

  var baseCubeGeom = new THREE.BoxGeometry(this.length, this.width, this.height);
  this.meshBoundingBox = new THREE.Mesh(baseCubeGeom, new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 }));
  //this.add( this.meshBoundingBox )

  this.baseOutline = new _BaseOutline2.default(this.length, this.width, delta);
  this.add(this.baseOutline);

  var widthArrowPos = new THREE.Vector3(delta.x + this.length / 2, delta.y, delta.z - this.height / 2);
  var lengthArrowPos = new THREE.Vector3(delta.x, delta.y + this.width / 2, delta.z - this.height / 2);
  var heightArrowPos = new THREE.Vector3(delta.x - this.length / 2, delta.y + this.width / 2, delta.z);
  //console.log("width", this.width, "length", this.length, "height", this.height,"delta",delta, "widthArrowPos", widthArrowPos)
  var sideLength = this.sideLength;

  //length, sideLength, position, direction, color, text, textSize,
  this.widthArrow = new _SizeHelper2.default({ length: this.width, sideLength: sideLength,
    direction: new THREE.Vector3(0, 1, 0),
    textBgColor: this.textBgColor, textColor: this.textColor, arrowColor: this.textColor, sideLineColor: this.textColor, labelType: this.labelType });

  this.lengthArrow = new _SizeHelper2.default({ length: this.length, sideLength: sideLength,
    direction: new THREE.Vector3(-1, 0, 0),
    textBgColor: this.textBgColor, textColor: this.textColor, arrowColor: this.textColor, sideLineColor: this.textColor, labelType: this.labelType });

  this.heightArrow = new _SizeHelper2.default({ length: this.height, sideLength: sideLength,
    direction: new THREE.Vector3(0, 0, 1),
    textBgColor: this.textBgColor, textColor: this.textColor, arrowColor: this.textColor, sideLineColor: this.textColor, labelType: this.labelType });

  this.lengthArrow.position.copy(lengthArrowPos);
  this.widthArrow.position.copy(widthArrowPos);
  this.heightArrow.position.copy(heightArrowPos);

  this.arrows = new THREE.Object3D();
  this.arrows.add(this.widthArrow);
  this.arrows.add(this.lengthArrow);
  this.arrows.add(this.heightArrow);

  this.add(this.arrows);

  this.objectOriginalPosition = this.mesh.position.clone();
  var offsetPosition = this.objectOriginalPosition.clone().sub(new THREE.Vector3(0, 0, this.height / 2));
  this.position.copy(offsetPosition);
};

ObjectDimensionsHelper.prototype.detach = function (mesh) {
  this.mesh = null;
  //this.remove( this.meshBoundingBox );
  this.remove(this.baseOutline);
  this.remove(this.arrows);

  this.objectOriginalPosition = new THREE.Vector3();
  this.position.copy(new THREE.Vector3());
};

ObjectDimensionsHelper.prototype.update = function () {
  //FIXME: VERY costly, needs optimising : is all this needed all the time ?
  var foo = this.mesh.position.clone().sub(this.objectOriginalPosition);
  this.position.add(foo);
  this.objectOriginalPosition = this.mesh.position.clone();

  //check if scale update is needed
  var dims = this.getBounds(this.mesh);
  if (this.length != dims[0] || this.width != dims[1] || this.height != dims[2]) {
    var _mesh = this.mesh;
    this.width = dims[1];
    this.length = dims[0];
    this.height = dims[2];

    //update base outline
    this.baseOutline.setLength(this.length);
    this.baseOutline.setWidth(this.width);

    var midPoint = this.computeMiddlePoint(_mesh);
    var lengthArrowPos = new THREE.Vector3(midPoint.x, midPoint.y + this.width / 2, midPoint.z - this.height / 2);
    var widthArrowPos = new THREE.Vector3(midPoint.x + this.length / 2, midPoint.y, midPoint.z - this.height / 2);
    var heightArrowPos = new THREE.Vector3(midPoint.x - this.length / 2, midPoint.y + this.width / 2, midPoint.z);

    this.lengthArrow.setLength(this.length);
    this.widthArrow.setLength(this.width);
    this.heightArrow.setLength(this.height);

    this.lengthArrow.position.copy(lengthArrowPos);
    this.widthArrow.position.copy(widthArrowPos);
    this.heightArrow.position.copy(heightArrowPos);

    this.baseOutline.position.z = midPoint.z - this.height / 2;
  }
};

ObjectDimensionsHelper.prototype.computeMiddlePoint = function (mesh) {
  var middle = new THREE.Vector3();
  middle.x = (mesh.boundingBox.max.x + mesh.boundingBox.min.x) / 2;
  middle.y = (mesh.boundingBox.max.y + mesh.boundingBox.min.y) / 2;
  middle.z = (mesh.boundingBox.max.z + mesh.boundingBox.min.z) / 2;
  //console.log("mid",geometry.boundingBox.max.z,geometry.boundingBox.min.z, geometry.boundingBox.max.z+geometry.boundingBox.min.z)
  return middle;
};

ObjectDimensionsHelper.prototype.getBounds = function (mesh) {
  //console.log("gna");
  var bbox = new _Box3C2.default().setFromObject(mesh); //new THREE.Box3().setFromObject( mesh );
  //FIXME: needs to ignore any helpers
  //in the hierarchy

  var length = (bbox.max.x - bbox.min.x).toFixed(2) / 1; // division by one to coerce to number
  var width = (bbox.max.y - bbox.min.y).toFixed(2) / 1;
  var height = (bbox.max.z - bbox.min.z).toFixed(2) / 1;

  return [length, width, height];
};

module.exports = ObjectDimensionsHelper;