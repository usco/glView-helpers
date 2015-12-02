"use strict";

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.GizmoLineMaterial = exports.GizmoMaterial = undefined;

var _three = require("three");

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GizmoMaterial = function GizmoMaterial(parameters) {
		_three2.default.MeshBasicMaterial.call(this);
		this.side = _three2.default.DoubleSide;
		if ("lineWidth" in parameters) delete parameters.lineWidth;
		this.setValues(parameters);

		this.highlightColor = parameters.highlightColor !== undefined ? parameters.highlightColor : 0xFFFF00;
		this.oldColor = this.color.clone();
		//this.oldOpacity = this.opacity

		this.highlight = function (highlighted) {

				if (highlighted) {

						this.color.set(this.highlightColor);
				} else {

						this.color.copy(this.oldColor);
				}
		};
};

GizmoMaterial.prototype = Object.create(_three2.default.MeshBasicMaterial.prototype);

var GizmoLineMaterial = function GizmoLineMaterial(parameters) {
		_three2.default.LineBasicMaterial.call(this);

		this.highlightColor = parameters.highlightColor !== undefined ? parameters.highlightColor : "#ffd200";
		this.linewidth = parameters.lineWidth || parameters.linewidth || 1;

		if ("lineWidth" in parameters) delete parameters.lineWidth;
		if ("highlightColor" in parameters) delete parameters.highlightColor;

		this.setValues(parameters);

		this.oldColor = this.color.clone();

		this.highlight = function (highlighted) {

				if (highlighted) {

						this.color.set(this.highlightColor);
				} else {

						this.color.copy(this.oldColor);
				}
		};
};

GizmoLineMaterial.prototype = Object.create(_three2.default.LineBasicMaterial.prototype);

exports.GizmoMaterial = GizmoMaterial;
exports.GizmoLineMaterial = GizmoLineMaterial;