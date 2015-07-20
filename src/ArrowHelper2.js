import THREE from "three"
/**
Based on ArrowHelper by : 
 * @author WestLangley / http://github.com/WestLangley
 * @author zz85 / http://github.com/zz85
 * @author bhouston / http://exocortex.com
 *
 * Creates an arrow for visualizing directions
 *
 * Parameters:
 *  dir - Vector3
 *  origin - Vector3
 *  length - Number
 *  color - color in hex value
 *  headLength - Number
 *  headWidth - Number
 */

export default class ArrowHelper extends THREE.Object3D{

  constructor( dir, origin, length, color, headLength, headWidth, headType ){

    var lineGeometry = new THREE.Geometry()
    lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) )

    var headGeometry = new THREE.CylinderGeometry( 0, 0.5, 1, 5, 1 )
    headGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, - 0.5, 0 ) )

    super()
    // dir is assumed to be normalized

    if ( color === undefined ) color = 0xffff00
    if ( length === undefined ) length = 1
    if ( headLength === undefined ) headLength = 0.2 * length
    if ( headWidth === undefined ) headWidth = 0.2 * headLength
    if(headType){
      switch(headType){
        case "sphere":
          headGeometry = new THREE.SphereGeometry( 0.5, 32,32 )
          headGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, - 0.5, 0 ) )
          headLength = headWidth 
        break
        case "arrowOutline":
          let arrowShape = new THREE.Shape()
          arrowShape.moveTo( -headWidth/2,0 )
          arrowShape.lineTo( 0, -headLength )
          arrowShape.lineTo( headWidth/2, 0 )
          arrowShape.lineTo( headWidth/2, 0 )
          headGeometry = new THREE.ShapeGeometry( arrowShape )
          //let textBorderOutline = new THREE.Line( textBorderGeom, material ) 
        break

      }

    }


    this.position.copy( origin )

    this.line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: color } ) )
    this.line.matrixAutoUpdate = false
    this.add( this.line )

    this.head = new THREE.Mesh( headGeometry, new THREE.MeshBasicMaterial( { color: color } ) )
    this.head.matrixAutoUpdate = false
    this.add( this.head )

    this.setDirection( dir )
    this.setLength( length, headLength, headWidth )
  }


  setDirection(dir){
    var axis = new THREE.Vector3()
    var radians
        // dir is assumed to be normalized

    if ( dir.y > 0.99999 ) {

      this.quaternion.set( 0, 0, 0, 1 )

    } else if ( dir.y < - 0.99999 ) {

      this.quaternion.set( 1, 0, 0, 0 )

    } else {

      axis.set( dir.z, 0, - dir.x ).normalize()

      radians = Math.acos( dir.y )

      this.quaternion.setFromAxisAngle( axis, radians )

    }
  }
  
  setLength ( length, headLength, headWidth ) {
    if ( headLength === undefined ) headLength = 0.2 * length
    if ( headWidth === undefined ) headWidth = 0.2 * headLength

    this.line.scale.set( 1, length - headLength, 1 )
    this.line.updateMatrix()

    this.head.scale.set( headWidth, headLength, headWidth )
    this.head.position.y = length
    this.head.updateMatrix()

  }

  setColor( color ) {
    this.line.material.color.set( color );
    this.head.material.color.set( color );
  }

}







