import THREE from 'three'
import BaseHelper from "./BaseHelper"
import {GizmoMaterial,GizmoLineMaterial} from "./GizmoMaterial"

/*
 id: inner diameter : blank space at center of cross
*/
class CrossHelper extends BaseHelper{
  constructor( options ) {
    const DEFAULTS = {
      size:5,
      color:"#0F0",
      highlightColor: "#F00",
      opacity:0.8,
      internalDiameter:0 //??huh 
    }

    options = Object.assign({}, DEFAULTS, options) 
    super(options)
    Object.assign(this, options)
 
    let {internalDiameter,opacity, size} = this
    let offsetPos = size/2 + internalDiameter/2
    //starting point cross
    let startCrossGeometry = new THREE.Geometry()
    startCrossGeometry.vertices.push( new THREE.Vector3( 0, -offsetPos, 0 ) )
    startCrossGeometry.vertices.push( new THREE.Vector3( 0, -internalDiameter/2, 0 ) )
    startCrossGeometry.vertices.push( new THREE.Vector3( 0, offsetPos , 0 ) )
    startCrossGeometry.vertices.push( new THREE.Vector3( 0, internalDiameter/2 , 0 ) )
    
    startCrossGeometry.vertices.push( new THREE.Vector3( -offsetPos, 0, 0 ) )
    startCrossGeometry.vertices.push( new THREE.Vector3( -internalDiameter/2, 0, 0 ) )
    startCrossGeometry.vertices.push( new THREE.Vector3( offsetPos, 0 , 0 ) )
    startCrossGeometry.vertices.push( new THREE.Vector3( internalDiameter/2, 0 , 0 ) )
    
    this.centerCross = new THREE.Line( startCrossGeometry, 
      new GizmoLineMaterial( { 
        color: this.color,
        highlightColor:this.highlightColor, 
        lineWidth:this.lineWidth,
        opacity:opacity, 
        transparent:true, 
        side:THREE.FrontSide } ),THREE.LinePieces )
    this.centerCross.material.depthTest   = false
    this.centerCross.material.depthWrite  = false
    this.centerCross.material.renderDepth = 1e20
    
    this.add( this.centerCross ) 
  }
}

export default CrossHelper
