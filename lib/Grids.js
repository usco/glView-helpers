'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LabeledGrid = exports.CircularLabeledGrid = undefined;

var _CircularLabeledGrid = require('./grids/CircularLabeledGrid');

var _CircularLabeledGrid2 = _interopRequireDefault(_CircularLabeledGrid);

var _LabeledGrid = require('./grids/LabeledGrid');

var _LabeledGrid2 = _interopRequireDefault(_LabeledGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*module.exports ={
  CircularLabeledGrid: require('./grids/CircularLabeledGrid'),
  LabeledGrid: require('./grids/LabeledGrid')
}*/

exports.CircularLabeledGrid = _CircularLabeledGrid2.default;
exports.LabeledGrid = _LabeledGrid2.default;