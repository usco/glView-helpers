import THREE from 'three'

let GizmoMaterial = function ( parameters ) {
		THREE.MeshBasicMaterial.call( this )
		this.side = THREE.DoubleSide
		this.setValues( parameters )
		
		this.highlightColor = parameters.highlightColor !== undefined ? parameters.highlightColor : 0xFFFF00
		this.oldColor = this.color.clone()
		//this.oldOpacity = this.opacity

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.set( this.highlightColor )

			} else {

					this.color.copy( this.oldColor )
			}

		}
}

GizmoMaterial.prototype = Object.create( THREE.MeshBasicMaterial.prototype )

let GizmoLineMaterial = function ( parameters ) {
		THREE.LineBasicMaterial.call( this )
		this.setValues( parameters )
		
		this.highlightColor = parameters.highlightColor !== undefined ? parameters.highlightColor : "#ffd200"
		this.linewidth = parameters.lineWidth || parameters.linewidth || 1

		this.oldColor = this.color.clone()

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.set( this.highlightColor )

			} else {

					this.color.copy( this.oldColor )
			}
		}
}

GizmoLineMaterial.prototype = Object.create( THREE.LineBasicMaterial.prototype )

export {GizmoMaterial,GizmoLineMaterial}
