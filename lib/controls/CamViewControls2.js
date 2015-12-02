"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

var _GizmoMaterial = require("../GizmoMaterial");

var _LabeledAxes = require("../LabeledAxes");

var _LabeledAxes2 = _interopRequireDefault(_LabeledAxes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//FIXME: hack
_three2.default.Vector3.prototype.pickingRay = function (camera) {
  var tan = Math.tan(0.5 * _three2.default.Math.degToRad(camera.fov)) / camera.zoom;

  this.x *= tan * camera.aspect;
  this.y *= tan;
  this.z = -1;

  return this.transformDirection(camera.matrixWorld);
};

var CubeEdge = (function (_THREE$Mesh) {
  _inherits(CubeEdge, _THREE$Mesh);

  function CubeEdge(size, width, color, position, selectionCallback) {
    _classCallCheck(this, CubeEdge);

    var size = size || 10;
    var width = width || 4;
    var position = position || new _three2.default.Vector3();
    var color = color || 0xFF0000;

    var midSize = size - width * 2;
    var planeGeometry = new _three2.default.PlaneGeometry(midSize, width, 2, 2);
    planeGeometry.applyMatrix(new _three2.default.Matrix4().makeRotationX(Math.PI / 2));
    planeGeometry.applyMatrix(new _three2.default.Matrix4().makeRotationY(Math.PI / 2));
    planeGeometry.applyMatrix(new _three2.default.Matrix4().makeTranslation(-width / 2, 0, size / 2));

    var planeGeometry2 = planeGeometry.clone();
    planeGeometry2.applyMatrix(new _three2.default.Matrix4().makeRotationZ(Math.PI / 2));

    //final geometry
    var geometry = new _three2.default.Geometry();
    geometry.merge(planeGeometry);
    geometry.merge(planeGeometry2);
    //geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, width/2 , 0 ) );
    geometry = new _three2.default.BoxGeometry(width, width, midSize);
    geometry.applyMatrix(new _three2.default.Matrix4().makeTranslation(-width / 2, -width / 2, size / 2));

    var material = new _GizmoMaterial.GizmoMaterial({ color: color
    });
    //depthTest:false, depthWrite:false

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CubeEdge).call(this, geometry, material));

    _this.selectionCallback = selectionCallback;
    _this.position.copy(position);
    return _this;
  }

  _createClass(CubeEdge, [{
    key: "onSelect",
    value: function onSelect() {
      if (this.selectionCallback) {
        this.selectionCallback(this.name);
      }
    }
  }]);

  return CubeEdge;
})(_three2.default.Mesh);

var CubePlane = (function (_THREE$Mesh2) {
  _inherits(CubePlane, _THREE$Mesh2);

  function CubePlane(size, color, position, selectionCallback) {
    _classCallCheck(this, CubePlane);

    var size = size || 10;
    var position = position || new _three2.default.Vector3();
    var color = color || 0xFF0000;

    var geometry = new _three2.default.PlaneBufferGeometry(size, size, 2, 2);
    var material = new _GizmoMaterial.GizmoMaterial({ color: color
    });

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(CubePlane).call(this, geometry, material));

    _this2.position.copy(position);
    _this2.selectionCallback = selectionCallback;
    return _this2;
  }

  _createClass(CubePlane, [{
    key: "onSelect",
    value: function onSelect() {
      if (this.selectionCallback) {
        this.selectionCallback(this.name);
      }
    }
  }]);

  return CubePlane;
})(_three2.default.Mesh);

var CubeCorner = (function (_THREE$Mesh3) {
  _inherits(CubeCorner, _THREE$Mesh3);

  function CubeCorner(size, color, position, selectionCallback) {
    _classCallCheck(this, CubeCorner);

    var size = size || 10;
    var position = position || new _three2.default.Vector3();
    var color = color || 0xFF0000;

    var geometry = new _three2.default.BoxGeometry(size, size, size);
    var material = new _GizmoMaterial.GizmoMaterial({ color: color
    });

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(CubeCorner).call(this, geometry, material));

    _this3.selectionCallback = selectionCallback;
    _this3.position.copy(position);
    return _this3;
  }

  _createClass(CubeCorner, [{
    key: "onSelect",
    value: function onSelect() {
      if (this.selectionCallback) {
        this.selectionCallback(this.name);
      }
    }
  }]);

  return CubeCorner;
})(_three2.default.Mesh);

var ViewCubeGizmo = (function (_THREE$Object3D) {
  _inherits(ViewCubeGizmo, _THREE$Object3D);

  function ViewCubeGizmo(controlledCameras, position, options) {
    _classCallCheck(this, ViewCubeGizmo);

    var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(ViewCubeGizmo).call(this));

    var options = options || {};

    _this4.size = options.size !== undefined ? options.size : 15;
    _this4.cornerWidth = options.cornerWidth !== undefined ? options.cornerWidth : 3;

    _this4.planesColor = options.planesColor !== undefined ? options.planesColor : 0x77FF00;
    _this4.edgesColor = options.edgesColor !== undefined ? options.edgesColor : 0xFF7700;
    _this4.cornersColor = options.cornersColor !== undefined ? options.cornersColor : 0x0077FF;
    _this4.highlightColor = options.highlightColor !== undefined ? options.highlightColor : 0xFFFF00;
    _this4.opacity = options.opacity !== undefined ? options.opacity : 1;

    var position = position || new _three2.default.Vector3();
    var cornerWidth = _this4.cornerWidth;
    var size = _this4.size;
    var planesColor = _this4.planesColor;
    var edgesColor = _this4.edgesColor;
    var cornersColor = _this4.cornersColor;

    /*var size        = size || 10;
    var cornerWidth = cornerWidth || 4;
    
    var planesColor = planesColor || 0x00FF00;
    var edgesColor  = edgesColor  || 0x0000FF;
    var cornersColor= cornersColor|| 0xFF0000;*/
    var controlledCameras = controlledCameras;

    _this4.edges = new _three2.default.Object3D();
    _this4.planes = new _three2.default.Object3D();
    _this4.corners = new _three2.default.Object3D();

    var orientationMap = {
      "F": "Front",
      "B": "Back",
      "L": "Left",
      "R": "Right",
      "A": "Top",
      "U": "Bottom",

      "FL": "FrontLeft",
      "FR": "FrontRight",
      "FT": "FrontTop",
      "FB": "FrontBottom",

      "BL": "BackLeft",
      "BR": "BackRight",
      "BT": "BackTop",
      "BB": "BackBottom",

      "LT": "LeftTop",
      "LB": "LeftBottom",
      "RT": "RightTop",
      "RB": "RightBottom",

      "FTL": "FrontTopLeft",
      "FTR": "FrontTopRight",
      "FBL": "FrontBottomLeft",
      "FBR": "FrontBottomRight",

      "BTL": "BackTopLeft",
      "BTR": "BackTopRight",
      "BBL": "BackBottomLeft",
      "BBR": "BackBottomRight"
    };

    var orientationCallback = function orientationCallback(orientationShortName) {
      for (var i = 0; i < controlledCameras.length; i++) {
        var controlledCamera = controlledCameras[i];
        //console.log("yeahn orientation selected : "+orientationShortName+" in ",controlledCamera);
        //controlledCamera.orientation = orientationMap[orientationShortName];
        var methodName = "to" + orientationMap[orientationShortName] + "View";
        console.log("yeahn orientation selected : " + orientationShortName + " in ", controlledCamera, "callin", methodName);
        if (controlledCamera[methodName]) controlledCamera[methodName]();
      }
    };

    //planes
    var plSize = size - cornerWidth * 2;
    var planes = {
      "F": new CubePlane(plSize, planesColor, null, orientationCallback),
      "B": new CubePlane(plSize, planesColor, null, orientationCallback),
      "L": new CubePlane(plSize, planesColor, null, orientationCallback),
      "R": new CubePlane(plSize, planesColor, null, orientationCallback),
      "A": new CubePlane(plSize, planesColor, null, orientationCallback),
      "U": new CubePlane(plSize, planesColor, null, orientationCallback)
    };

    planes["F"].rotation.set(0, Math.PI / 2, 0);
    planes["F"].position.set(size / 2, 0, size / 2);
    planes["B"].rotation.set(0, -Math.PI / 2, 0);
    planes["B"].position.set(-size / 2, 0, size / 2);

    planes["L"].rotation.set(-Math.PI / 2, 0, -Math.PI);
    planes["L"].position.set(0, size / 2, size / 2);
    planes["R"].rotation.set(-Math.PI / 2, 0, -Math.PI);
    planes["R"].position.set(0, -size / 2, size / 2);

    planes["A"].position.set(0, 0, size);
    planes["U"].position.set(0, 0, 0);

    for (var i in planes) {
      planes[i].name = i;
      _this4.planes.add(planes[i]);
      _this4.planes[i] = planes[i];
      planes[i].visible = false;
    }

    //edges
    var edges = {
      "FL": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "FR": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "FT": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "FB": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),

      "BL": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "BR": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "BT": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "BB": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),

      "LT": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "LB": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "RT": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback),
      "RB": new CubeEdge(size, cornerWidth, edgesColor, null, orientationCallback)
    };

    size += 0.1;
    //front
    edges["FL"].rotation.set(0, 0, -Math.PI / 2);
    edges["FL"].position.set(size / 2, -size / 2, 0);
    edges["FR"].position.set(size / 2, size / 2, 0);

    edges["FT"].rotation.set(Math.PI / 2, 0, 0);
    edges["FT"].position.set(size / 2, size / 2, size);
    edges["FB"].rotation.set(-Math.PI / 2, 0, 0);
    edges["FB"].position.set(size / 2, -size / 2, 0);

    //back	
    edges["BL"].rotation.set(0, 0, Math.PI / 2);
    edges["BL"].position.set(-size / 2, size / 2, 0);
    edges["BR"].rotation.set(0, 0, -Math.PI);
    edges["BR"].position.set(-size / 2, -size / 2, 0);

    edges["BT"].rotation.set(Math.PI / 2, Math.PI, 0);
    edges["BT"].position.set(-size / 2, -size / 2, size);
    edges["BB"].rotation.set(-Math.PI / 2, Math.PI, 0);
    edges["BB"].position.set(-size / 2, size / 2, 0);

    //sides (left/right)
    edges["LT"].rotation.set(Math.PI / 2, -Math.PI / 2, 0);
    edges["LT"].position.set(size / 2, -size / 2, size);
    edges["LB"].rotation.set(Math.PI, -Math.PI / 2, 0);
    edges["LB"].position.set(size / 2, -size / 2, 0);

    edges["RT"].rotation.set(Math.PI / 2, Math.PI / 2, 0);
    edges["RT"].position.set(-size / 2, size / 2, size);

    edges["RB"].rotation.set(0, Math.PI / 2, 0);
    edges["RB"].position.set(-size / 2, size / 2, 0);

    for (var i in edges) {
      edges[i].name = i;
      _this4.edges.add(edges[i]);
      _this4.edges[i] = edges[i];
      edges[i].visible = false;
    }

    //corners
    size -= 0.1;
    var cSize = cornerWidth;
    var corners = {
      "FTL": new CubeCorner(cSize, cornersColor, null, orientationCallback),
      "FTR": new CubeCorner(cSize, cornersColor, null, orientationCallback),
      "FBL": new CubeCorner(cSize, cornersColor, null, orientationCallback),
      "FBR": new CubeCorner(cSize, cornersColor, null, orientationCallback),

      "BTL": new CubeCorner(cSize, cornersColor, null, orientationCallback),
      "BTR": new CubeCorner(cSize, cornersColor, null, orientationCallback),
      "BBL": new CubeCorner(cSize, cornersColor, null, orientationCallback),
      "BBR": new CubeCorner(cSize, cornersColor, null, orientationCallback)
    };

    corners["FTL"].position.set((size - cSize) / 2, -(size - cSize) / 2, size - cSize / 2);
    corners["FTR"].position.set((size - cSize) / 2, (size - cSize) / 2, size - cSize / 2);
    corners["FBL"].position.set((size - cSize) / 2, -(size - cSize) / 2, cSize / 2);
    corners["FBR"].position.set((size - cSize) / 2, (size - cSize) / 2, cSize / 2);

    corners["BTL"].position.set(-(size - cSize) / 2, -(size - cSize) / 2, size - cSize / 2);
    corners["BTR"].position.set(-(size - cSize) / 2, (size - cSize) / 2, size - cSize / 2);
    corners["BBL"].position.set(-(size - cSize) / 2, -(size - cSize) / 2, cSize / 2);
    corners["BBR"].position.set(-(size - cSize) / 2, (size - cSize) / 2, cSize / 2);

    for (var i in corners) {
      corners[i].name = i;
      _this4.corners.add(corners[i]);
      _this4.corners[i] = corners[i];
      corners[i].visible = false;
    }

    _this4.add(_this4.edges);
    _this4.add(_this4.planes);
    _this4.add(_this4.corners);

    _this4.position.copy(position);

    var self = _this4;
    _this4.traverse(function (child) {
      if (child.material) {
        child.material.opacity = self.opacity;
        child.material.transparent = true;
        if (child.material.highlightColor) {
          child.material.highlightColor = self.highlightColor;
        }
      }
    });
    return _this4;
  }

  _createClass(ViewCubeGizmo, [{
    key: "hide",
    value: function hide() {
      this.traverse(function (child) {
        child.visible = false;
      });
    }
  }, {
    key: "show",
    value: function show() {
      this.traverse(function (child) {
        child.visible = true;
      });
    }
  }, {
    key: "highlight",
    value: function highlight(item) {
      this.traverse(function (child) {
        if (child.material && child.material.highlight) {
          if (child.name == item) {
            child.material.highlight(true);
          } else {
            child.material.highlight(false);
          }
        }
      });
    }
  }]);

  return ViewCubeGizmo;
})(_three2.default.Object3D);

var CamViewControls = (function (_THREE$Object3D2) {
  _inherits(CamViewControls, _THREE$Object3D2);

  function CamViewControls(options, controlledCameras) {
    _classCallCheck(this, CamViewControls);

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(CamViewControls).call(this));

    var options = options || {};

    _this5.planesColor = options.planesColor !== undefined ? options.planesColor : 0x00FF00;
    _this5.edgesColor = options.edgesColor !== undefined ? options.edgesColor : 0xFF0000;
    _this5.cornersColor = options.cornersColor !== undefined ? options.cornersColor : 0x0000FF;
    _this5.highlightColor = options.highlightColor !== undefined ? options.highlightColor : 0xFFFF00;
    _this5.opacity = options.opacity !== undefined ? options.opacity : 1;

    _this5.size = options.size !== undefined ? options.size : 15;
    _this5.cornerWidth = options.cornerWidth !== undefined ? options.cornerWidth : 3;

    var gizmoPos = new _three2.default.Vector3(_this5.size / 2, _this5.size / 2, 0);
    _this5.viewCubeGizmo = new ViewCubeGizmo(controlledCameras, gizmoPos, options);
    /*new ViewCubeGizmo(this.size, this.cornerWidth, 
     
     , this.edgesColor, this.planesColor, this.cornersColor, controlledCameras);*/

    _this5.add(_this5.viewCubeGizmo);
    _this5.add(new _LabeledAxes2.default(options));
    return _this5;
  }

  _createClass(CamViewControls, [{
    key: "init",
    value: function init(camera, domElement) {
      console.log("attaching CamViewControls controls to", domElement);
      this.domElement = domElement;
      this.camera = camera;

      var scope = this;

      var ray = new _three2.default.Raycaster();
      var pointerVector = new _three2.default.Vector3();

      var point = new _three2.default.Vector3();
      var offset = new _three2.default.Vector3();

      var camPosition = new _three2.default.Vector3();
      var camRotation = new _three2.default.Euler();

      this.camPosition = camPosition;
      this.camRotation = camRotation;

      var useCapture = false;
      var changeEvent = { type: 'change' };

      domElement.addEventListener("mousedown", onPointerDown, useCapture);
      domElement.addEventListener("touchstart", onPointerDown, useCapture);

      domElement.addEventListener("mousemove", onPointerMove, useCapture);
      domElement.addEventListener("touchmove", onPointerMove, useCapture);

      domElement.addEventListener("mouseup", onPointerUp, useCapture);
      domElement.addEventListener("mouseout", onPointerUp, useCapture);
      domElement.addEventListener("touchend", onPointerUp, useCapture);
      domElement.addEventListener("touchcancel", onPointerUp, useCapture);
      domElement.addEventListener("touchleave", onPointerUp, useCapture);

      function intersectObjects(pointer, objects, isOrtho) {

        var rect = domElement.getBoundingClientRect();
        var x = pointer.offsetX; //;( pointer.offsetX - rect.left ) / rect.width;
        var y = pointer.offsetY; //;( pointer.offsetX - rect.top ) / rect.height;

        //pointerVector.set( (x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1, 1  );

        var x = (pointer.clientX - rect.left) / rect.width;
        var y = (pointer.clientY - rect.top) / rect.height;

        pointerVector.set(x * 2 - 1, -(y * 2) + 1, 0.5);

        if (!isOrtho) {
          pointerVector.unproject(camera);

          ray.set(camPosition, pointerVector.sub(camPosition).normalize());

          var intersections = ray.intersectObjects(objects, true);
        } else {

          pointerVector.pickingRay(camera);
          ray.set(camPosition, pointerVector);
          var intersections = ray.intersectObjects(objects, true);
        }
        return intersections[0] ? intersections[0] : false;
      }

      function onPointerMove(event) {

        event.preventDefault();
        event.stopPropagation();

        var pointer = event.changedTouches ? event.changedTouches[0] : event;

        var intersect = intersectObjects(pointer, scope.viewCubeGizmo.children, true);

        if (intersect && intersect.object.name) {
          scope.activeItem = intersect.object.name;
          scope.viewCubeGizmo.show();
        } else {
          scope.activeItem = null;
          scope.viewCubeGizmo.hide();
        }
        //intersect
        //point.copy( planeIntersect.point );
        scope.dispatchEvent(changeEvent);
      }
      function onPointerDown(event) {
        //console.log("pointer up in camView controls");

        var pointer = event.changedTouches ? event.changedTouches[0] : event;
        var intersect = intersectObjects(pointer, scope.viewCubeGizmo.children, true);
        if (intersect && intersect.object.onSelect) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          intersect.object.onSelect();

          scope.dispatchEvent(changeEvent);
        }
      }

      function onPointerUp(event) {
        scope.activeItem = null;
        scope.viewCubeGizmo.hide();
      }
    }
  }, {
    key: "intersectObjects",
    value: function intersectObjects(pointer, objects) {

      var rect = domElement.getBoundingClientRect();
      var x = (pointer.clientX - rect.left) / rect.width;
      var y = (pointer.clientY - rect.top) / rect.height;

      pointerVector.set(x * 2 - 1, -(y * 2) + 1, 0.5);
      pointerVector.unproject(camera);

      ray.set(camPosition, pointerVector.sub(camPosition).normalize());

      var intersections = ray.intersectObjects(objects, true);
      return intersections[0] ? intersections[0] : false;
    }
  }, {
    key: "update",
    value: function update() {
      this.camera.updateMatrixWorld();
      this.camPosition.setFromMatrixPosition(this.camera.matrixWorld);
      //this.camRotation.setFromRotationMatrix( tempMatrix.extractRotation( camera.matrixWorld ) );
      //this.gizmo[_mode].highlight( scope.axis );
      this.viewCubeGizmo.highlight(this.activeItem);
    }

    //event listener stuff

  }, {
    key: "addEventListener",
    value: function addEventListener(type, listener) {

      if (this._listeners === undefined) this._listeners = {};

      var listeners = this._listeners;

      if (listeners[type] === undefined) {

        listeners[type] = [];
      }

      if (listeners[type].indexOf(listener) === -1) {

        listeners[type].push(listener);
      }
    }
  }, {
    key: "hasEventListener",
    value: function hasEventListener(type, listener) {

      if (this._listeners === undefined) return false;

      var listeners = this._listeners;

      if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {

        return true;
      }

      return false;
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {

      if (this._listeners === undefined) return;

      var listeners = this._listeners;
      var listenerArray = listeners[type];

      if (listenerArray !== undefined) {

        var index = listenerArray.indexOf(listener);

        if (index !== -1) {

          listenerArray.splice(index, 1);
        }
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (this._listeners === undefined) return;

      var listeners = this._listeners;
      var listenerArray = listeners[event.type];

      if (listenerArray !== undefined) {

        event.target = this;

        var array = [];
        var length = listenerArray.length;

        for (var i = 0; i < length; i++) {

          array[i] = listenerArray[i];
        }

        for (var i = 0; i < length; i++) {

          array[i].call(this, event);
        }
      }
    }
  }]);

  return CamViewControls;
})(_three2.default.Object3D);

exports.default = CamViewControls;