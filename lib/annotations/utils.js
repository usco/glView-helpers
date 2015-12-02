"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTargetBoundsData = getTargetBoundsData;
exports.computeCenterDiaNormalFromThreePoints = computeCenterDiaNormalFromThreePoints;
exports.getEntryExitThickness = getEntryExitThickness;

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getTargetBoundsData(targetObject, point) {
  console.log("computing bounds");
  /* -1 /+1 directions on all 3 axis to determine for example WHERE an annotation
  should be placed (left/right, front/back, top/bottom)
  */
  var putSide = [0, 0, 0];
  if (!targetObject) return putSide;
  var bbox = targetObject.boundingBox;

  var objectCenter = new _three2.default.Vector3().addVectors(targetObject.boundingBox.min, targetObject.boundingBox.max).divideScalar(2);

  //let realCenter = point.clone().sub( objectCenter )
  //console.log("objectCenter",objectCenter,"point", point,foo.normalize())

  var axes = ["x", "y", "z"];
  axes.forEach(function (axis, index) {
    var axisOffset = point[axis] - objectCenter[axis];
    axisOffset = Math.round(axisOffset * 100) / 100;
    if (axisOffset > 0) {
      putSide[index] = 1;
    } else if (axisOffset < 0) {
      putSide[index] = -1;
    }
  });

  console.log("putSide", putSide);
  putSide = new _three2.default.Vector3().fromArray(putSide);
  return putSide;
}

//compute center , dia/radius from three 3d points
function computeCenterDiaNormalFromThreePoints(pointA, pointB, pointC) {

  var plane = new _three2.default.Plane().setFromCoplanarPoints(pointA, pointB, pointC);
  var center = new _three2.default.Vector3();

  //see http://en.wikipedia.org/wiki/Circumscribed_circle
  // triangle "edges"
  var t = pointA.clone().sub(pointB);
  var u = pointB.clone().sub(pointC);
  var v = pointC.clone().sub(pointA);
  var m = pointA.clone().sub(pointC);
  var x = pointB.clone().sub(pointA);
  var z = pointC.clone().sub(pointB);

  var foo = t.clone().cross(u).length();
  var bar = 2 * foo;
  var baz = foo * foo;
  var buu = 2 * baz;

  var radius = t.length() * u.length() * v.length() / bar;

  var alpha = u.lengthSq() * t.clone().dot(m) / buu;
  var beta = m.lengthSq() * x.clone().dot(u) / buu;
  var gamma = t.lengthSq() * v.clone().dot(z) / buu;

  center = pointA.clone().multiplyScalar(alpha).add(pointB.clone().multiplyScalar(beta)).add(pointC.clone().multiplyScalar(gamma));

  var diameter = radius * 2;
  var normal = plane.normal;

  return { center: center, diameter: diameter, normal: normal };
}

function getEntryExitThickness(entryInteresect) {
  var normalType = arguments.length <= 1 || arguments[1] === undefined ? "face" : arguments[1];

  var normal = entryInteresect.face.normal.clone();
  switch (normalType) {
    case "face":
      break;
    case "x":
      normal = new _three2.default.Vector3(1, 0, 0);
      break;
    case "y":
      normal = new _three2.default.Vector3(0, 1, 0);
      break;
    case "z":
      normal = new _three2.default.Vector3(0, 0, 1);
      break;
  }

  var object = entryInteresect.object;
  if (!object) return undefined;

  var entryPoint = entryInteresect.point.clone();
  var flippedNormal = normal.clone().negate();
  var offsetPoint = entryPoint.clone().add(flippedNormal.clone().multiplyScalar(10000));

  //get escape entryPoint
  var raycaster = new _three2.default.Raycaster(offsetPoint, normal.clone().normalize());
  var intersects = raycaster.intersectObjects([object], true);

  var exitPoint = null;
  var minDist = Infinity;

  intersects.map(function (entry) {
    var curPt = entry.point;
    var curLn = curPt.clone().sub(entryPoint).length();

    if (curLn < minDist) {
      exitPoint = curPt;
      minDist = curLn;
    }
  });

  //FIXME: todo or not ??
  object.worldToLocal(entryPoint);
  object.worldToLocal(exitPoint);

  //compute actual thickness
  var endToStart = exitPoint.clone().sub(entryPoint);
  var thickness = endToStart.length();

  return { object: object, entryPoint: entryPoint, exitPoint: exitPoint, thickness: thickness };
}