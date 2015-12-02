'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotations = exports.objectEffects = exports.CamViewControls = exports.meshTools = exports.planes = exports.grids = undefined;

var _Grids = require('./Grids');

var grids = _interopRequireWildcard(_Grids);

var _Planes = require('./Planes');

var planes = _interopRequireWildcard(_Planes);

var _CamViewControls = require('./controls/CamViewControls2');

var _CamViewControls2 = _interopRequireDefault(_CamViewControls);

var _annotations = require('./annotations/annotations');

var annotations = _interopRequireWildcard(_annotations);

var _zoomInOnObject = require('./objectEffects/zoomInOnObject');

var _zoomInOnObject2 = _interopRequireDefault(_zoomInOnObject);

var _centerMesh = require('./meshTools/centerMesh');

var _centerMesh2 = _interopRequireDefault(_centerMesh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//import * as objectEffects from './objectEffects'

var objectEffects = { ZoomInOnObject: _zoomInOnObject2.default }; /*module.exports ={
                                                                    grids: require('./Grids'),
                                                                    planes: require('./Planes'),
                                                                    mesthTools: require('./meshTools'),
                                                                    CamViewControls: require('./controls/CamViewControls2'),
                                                                    objectEffects: require('./objectEffects'),
                                                                    annotations: require('./annotations/annotations')
                                                                  }*/

var meshTools = { centerMesh: _centerMesh2.default };

exports.grids = grids;
exports.planes = planes;
exports.meshTools = meshTools;
exports.CamViewControls = _CamViewControls2.default;
exports.objectEffects = objectEffects;
exports.annotations = annotations;