"use strict";

Object.defineProperty(exports, "__esModule", {
			value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArrowHelper = (function (_THREE$Object3D) {
			_inherits(ArrowHelper, _THREE$Object3D);

			function ArrowHelper(direction, origin, length, color, headLength, headRadius, headColor) {
						_classCallCheck(this, ArrowHelper);

						var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ArrowHelper).call(this));

						_this.direction = direction || new _three2.default.Vector3(1, 0, 0);
						_this.origin = origin || new _three2.default.Vector3(0, 0, 0);
						_this.length = length || 50;
						_this.color = color || "#FF0000";
						_this.headLength = headLength || 6;
						_this.headRadius = headRadius || headLength / 7;
						_this.headColor = headColor || _this.color;

						//dir, origin, length, hex
						var lineGeometry = new _three2.default.Geometry();
						lineGeometry.vertices.push(_this.origin);
						lineGeometry.vertices.push(_this.direction.setLength(_this.length));
						_this.line = new _three2.default.Line(lineGeometry, new _three2.default.LineBasicMaterial({ color: _this.color }));
						_this.add(_this.line);

						_this.arrowHeadRootPosition = _this.origin.clone().add(_this.direction);
						_this.head = new _three2.default.Mesh(new _three2.default.CylinderGeometry(0, _this.headRadius, _this.headLength, 8, 1, false), new _three2.default.MeshBasicMaterial({ color: _this.headColor }));
						_this.head.position.copy(_this.arrowHeadRootPosition);

						_this.head.lookAt(_this.arrowHeadRootPosition.clone().add(_this.direction.clone().setLength(_this.headLength)));
						_this.head.rotateX(Math.PI / 2);

						_this.add(_this.head);
						return _this;
			}

			return ArrowHelper;
})(_three2.default.Object3D);

exports.default = ArrowHelper;