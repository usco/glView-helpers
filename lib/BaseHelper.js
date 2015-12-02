"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Abstract Base helper class
*/

var BaseHelper = (function (_THREE$Object3D) {
	_inherits(BaseHelper, _THREE$Object3D);

	function BaseHelper(options) {
		_classCallCheck(this, BaseHelper);

		var DEFAULTS = {
			name: "",
			debug: false
		};
		options = Object.assign({}, DEFAULTS, options);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseHelper).call(this, options));

		Object.assign(_this, options);
		return _this;
	}

	_createClass(BaseHelper, [{
		key: "setAsSelectionRoot",
		value: function setAsSelectionRoot(flag) {
			this.traverse(function (child) {
				child.selectable = !flag;
				child.selectTrickleUp = flag;
			});
			this.selectable = flag;
			this.selectTrickleUp = !flag;
		}
	}, {
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
		key: "setOpacity",
		value: function setOpacity(opacityPercent) {
			this.traverse(function (child) {
				if (child.material) {
					child.material.opacity = child.material.opacity * opacityPercent;
					if (child.material.opacity < 1) {
						child.material.transparent = true;
					}
					//console.log("applying opacity to ",child);
				} else {
						//console.log("not applying opacity to",child);
					}
			});
		}
	}, {
		key: "highlight",
		value: function highlight(flag) {
			this.traverse(function (child) {
				if (child.material && child.material.highlight) {
					child.material.highlight(flag);
				}
			});
		}
	}, {
		key: "highlight2",
		value: function highlight2(item) {
			this.traverse(function (child) {
				if (child.material && child.material.highlight) {
					if (child === item) {
						child.material.highlight(true);
						return;
					} else {
						child.material.highlight(false);
					}
				}
			});
		}
	}]);

	return BaseHelper;
})(_three2.default.Object3D);

exports.default = BaseHelper;