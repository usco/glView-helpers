import THREE from 'three'
import BaseHelper from "./BaseHelper"
import {GizmoMaterial,GizmoLineMaterial} from "./GizmoMaterial"

/*
 id: inner diameter : blank space at center of cross
*/
let CrossHelper = function(options)
{
  BaseHelper.call( this )
  let options = options || {}

  let size  = options.size!== undefined ? options.size : 5
  this.color = options.color!== undefined ? options.color : "#0F0"

  let opacity = this.opacity = options.opacity || 0.8
  let id = this.innerDia = options.id || 0

  
  let offsetPos = size/2 + id/2
  //starting point cross
  let startCrossGeometry = new THREE.Geometry()
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, -offsetPos, 0 ) )
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, -id/2, 0 ) )
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, offsetPos , 0 ) )
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, id/2 , 0 ) )
  
  startCrossGeometry.vertices.push( new THREE.Vector3( -offsetPos, 0, 0 ) )
  startCrossGeometry.vertices.push( new THREE.Vector3( -id/2, 0, 0 ) )
  startCrossGeometry.vertices.push( new THREE.Vector3( offsetPos, 0 , 0 ) )
  startCrossGeometry.vertices.push( new THREE.Vector3( id/2, 0 , 0 ) )
  
  this.centerCross = new THREE.Line( startCrossGeometry, 
    new GizmoLineMaterial( { color: this.color, opacity:opacity, transparent:true, side:THREE.FrontSide } ),THREE.LinePieces )
  this.centerCross.material.depthTest   = false
  this.centerCross.material.depthWrite  = false
  this.centerCross.material.renderDepth = 1e20
  
  this.add( this.centerCross ) 
}

CrossHelper.prototype = Object.create( BaseHelper.prototype )
CrossHelper.prototype.constructor = CrossHelper  

export default CrossHelper
