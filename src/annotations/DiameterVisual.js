import THREE from 'three'
import AnnotationVisual from "./AnnotationVisual"
import CrossHelper from "../CrossHelper"
import CircleHelper from "../CircleHelper"

import SizeHelper from "../dimensions/SizeHelper"
import LeaderLineHelper from "../dimensions/LeaderLineHelper"

import {GizmoMaterial,GizmoLineMaterial} from "../GizmoMaterial"




/*
  Helper to measure ... diameters
  
  Two step interactive version : 
    - place center
    - place diameter
*/
class DiameterVisual extends AnnotationVisual {
  constructor( options ) {
    const DEFAULTS = {
      diameter: 10,
      _position:new THREE.Vector3(),
      orientation: new THREE.Vector3(),
      textColor: "#ff0077",
      centerColor:"#F00",
      crossColor:"#F00",

      tolerance:0,//FIXME: this needs to be in all of the numerical measurement or not ? 
    }
    
    let options = Object.assign({}, DEFAULTS, options) 
    super(options)
    
    this.text   = options.text !== undefined ? options.text : this.diameter.toFixed(2)

    //FIXME: hack
    /*this.textColor = "#ff0077"
    this.arrowColor = this.textColor
    this.centerColor = this.textColor
    this.crossColor  = this.textColor
    this.textBgColor = "rgba(255, 255, 255, 0)"*/
        
    this.lineMaterial = new GizmoLineMaterial( { 
      color: this.lineColor,
      lineWidth: this.lineWidth,
      polygonOffset : true,
      polygonOffsetFactor : -0.5,
      side:THREE.FrontSide,
      depthWrite:false,
      depthTest:false,

      highlightColor:this.highlightColor
    })
    //depthTest:false, depthWrite:false,renderDepth : 1e20
   
    this.dimDisplayType = options.dimDisplayType!== undefined ? options.dimDisplayType : "offsetLine"
    this.centerCrossSize = 1.5
    
    this.center = undefined
    this.object = undefined
    this.pointA = undefined
    this.pointB = undefined
    this.pointC = undefined
    
    this._setupVisuals()
    this.setAsSelectionRoot( true )
  
    if( options.center )   this.setCenter( options.center )
    if( options.diameter ) this.setDiameter( options.diameter )
    if( options.orientation ) this.setOrientation( options.orientation )
    
  }
  
  set(){
    this.setCenter()
    this.setDiameter()
  }

  unset(){

    this.centerCross.hide()
    this.pointACross.hide()
    this.pointBCross.hide()
    this.pointCCross.hide()
    
    //this.sizeArrow.hide()
    this.leaderLine.hide()
    
    this.diaCircle.hide()
    
    this.position.copy( new THREE.Vector3() )
    this.setOrientation( new THREE.Vector3(0,0,1) )
  }

  /*configure all the basic visuals of this helper*/
  _setupVisuals(){
    //initialise internal sub objects
    this.centerCross = new CrossHelper({
      size:this.centerCrossSize,
      color:this.centerColor,
      highlightColor:this.highlightColor})
    this.centerCross.hide()
    this.add( this.centerCross )
        
    this.diaCircle = new CircleHelper({
      material : this.lineMaterial,
      highlightColor:this.highlightColor})
    this.diaCircle.hide()
    this.add( this.diaCircle )

     /*//pointA cross
    this.pointACross = new CrossHelper({size:this.centerCrossSize,color:this.crossColor})
    this.pointACross.hide()
    this.add( this.pointACross )
      
     //pointB cross
    this.pointBCross = new CrossHelper({size:this.centerCrossSize,color:this.crossColor})
    this.pointBCross.hide()
    this.add( this.pointBCross )
    
     //pointC cross
    this.pointCCross = new CrossHelper({size:this.centerCrossSize,color:this.crossColor})
    this.pointCCross.hide()
    this.add( this.pointCCross )*/

    /*this.sizeArrow = new SizeHelper({
    fontSize: this.fontSize,
    textColor: this.textColor, textBgColor:this.textBgColor, labelType:this.labelType,
    arrowColor:this.textColor, 
    sideLineColor:this.textColor,
    textPrefix:"∅ ",
    })
    this.sizeArrow.hide()
    this.add( this.sizeArrow )*/
    
    //TODO: add settable swtich between size helper & leader line
    //leader line
    
    //let text = this.text 
    let text = this.tolerance === 0 ? this.text : this.text+"±"+this.tolerance
    //text:"∅"+this.text+"±0.15"
    
    this.leaderLine = new LeaderLineHelper({
      text:text,
      radius:this.diameter/2,
      fontSize:this.fontSize, 
      textColor: this.textColor, 
      textBgColor:this.textBgColor,
      labelType : this.labelType,
      arrowColor:this.textColor,
      linesColor:this.lineColor,
      lineWidth:this.lineWidth,
      highlightColor:this.highlightColor
      })

    this.leaderLine.hide()
    this.add( this.leaderLine )  
  }

  setCenter( center, object ){
    if(center)  this.position.copy( center )
    if(center)  this.center = center
    if(object)  this.object = object
    
    this.centerCross.show()
    //FIXME: only needed if we do not offset this whole helper for positioning on the diam
    //this.centerCross.position.copy( this.center )
  }

  //for 3 point letiant
  setPointA( pointA, object ){
    if(pointA)  this.pointA = pointA
    this.object = object
    this.pointACross.position.copy( pointA )
    this.pointACross.show()
  }

  setPointB( pointB, object ){
    if(pointB)  this.pointB = pointB
    this.object = object
    this.pointBCross.position.copy( pointB )
    this.pointBCross.show()
  }

  setPointC( pointC, object ){
    if(pointC)  this.pointC = pointC
    this.object = object
    this.pointCCross.position.copy( pointC )
    this.pointCCross.show()
    
    this.setDataFromThreePoints()
  }

  setDiameter(diameter){
    if(!diameter && ! this.diameter){ 
      return
    }  
    this.diameter = diameter
    this.text     = this.diameter.toFixed(2)
    
    //this.sizeArrow.setLength( this.diameter )
    //this.sizeArrow.setSideLength( this.diameter/2+10 )
    
    this.diaCircle.setRadius( this.diameter/2)
    
    //this.sizeArrow.show()
    this.leaderLine.show()
    this.diaCircle.show()
  }

  setRadius(radius){
    if(!radius && ! this.diameter){ 
      return
    }  
    this.setDiameter( radius*2 )
  }

  /*Sets the radius/diameter from one 3d point
  */
  setRadiusPoint(point, normal){
    let radius = point.clone().sub( this.position ).length()
    this.setDiameter( radius*2 )
  }

  //compute center , dia/radius from three 3d points
  setDataFromThreePoints(){
    throw new Error("do not use")
    let {center,diameter,normal} = setDataFromThreePoints(this.pointA, this.pointB, this.pointC)
     
     this.setOrientation( plane.normal )
     this.setCenter( center )
     this.setRadius( radius )
     
     this.pointACross.position.copy( this.pointA.clone().sub( this.position ) )
     this.pointBCross.position.copy( this.pointB.clone().sub( this.position ) )
     this.pointCCross.position.copy( this.pointC.clone().sub( this.position ) )
  }

  setOrientation(orientation){
    this.orientation = orientation
    //console.log("this.orientation",this.orientation)
    
    let defaultOrientation = new THREE.Vector3(0,0,1) 
    let quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors ( defaultOrientation, this.orientation.clone() )
    this.rotation.setFromQuaternion( quaternion )
  }
}
  
export default DiameterVisual
