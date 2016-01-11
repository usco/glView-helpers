import THREE from 'three'
import BaseHelper from "./BaseHelper"
import {GizmoMaterial,GizmoLineMaterial} from "./GizmoMaterial"

/*
//TODO: make this into a mesh / geometry subclass
*/
class CircleHelper extends BaseHelper{
  constructor(options)
  {      

    let defaultMaterial = new GizmoLineMaterial( { 
      color: "#000", 
      depthTest:false, 
      depthWrite:false,
      renderDepth : 1e20,
      highlightColor:"#F00"
    })

    const DEFAULTS ={
      radius:0,
      direction: new THREE.Vector3(),

      color: "#000",
      highlightColor:"#F00",

      material: defaultMaterial
    }

    options = Object.assign({}, DEFAULTS, options)  
    super( options )    
    Object.assign(this, options)
        
    this.setRadius(this.radius)
  }

  setRadius( radius ){
    let circleRadius = this.radius = radius 
    let circleShape = new THREE.Shape()
    circleShape.moveTo( 0, 0 )
    circleShape.absarc( 0, 0, circleRadius, 0, Math.PI*2, false )
    circleShape.moveTo( 0, 0 )
    let points  = circleShape.createSpacedPointsGeometry( 100 )
    
    if(this.rCircle) this.remove( this.rCircle )
    
    this.rCircle = new THREE.Line(points, this.material )
    this.add( this.rCircle )
  }  


}



export default CircleHelper