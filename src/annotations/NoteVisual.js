import THREE from 'three'
import AnnotationVisual from "./AnnotationVisual"
import CrossHelper from "../CrossHelper"
import CircleHelper from "../CircleHelper"
import {GizmoMaterial,GizmoLineMaterial} from "../GizmoMaterial"
import LeaderLineHelper from "../dimensions/LeaderLineHelper"


/*
  Helper for basic notes (single point)
*/
class NoteVisual extends AnnotationVisual {
  constructor( options ) {
    const DEFAULTS = {
      crossColor:"#000",
      text:"A"
    }
    
    let options = Object.assign({}, DEFAULTS, options) 
    super(options)

    //initialise internal sub objects
    this._setupVisuals()
    
    this.point      = options.point!== undefined  ? options.point : undefined
    this.normal     = options.normal!== undefined ? options.normal :undefined
    this.object     = options.object!== undefined ? options.object : undefined
    
    if( options.point ) this.setPoint( this.point, this.object )
    
    this.setAsSelectionRoot( true )
  }
  
  _setupVisuals(){
    console.log("highlightColor",this.highlightColor,this.crossColor)
    this.pointCross = new CrossHelper({
      size:1.5,
      lineWidth:this.lineWidth,
      color:this.crossColor,
      highlightColor:this.highlightColor
    })
    this.pointCross.hide()
    this.add( this.pointCross )

    //this.pointCube = new THREE.Mesh(new THREE.SphereGeometry(1,20,20), new THREE.MeshBasicMaterial({color:0xFF00FF}))
    //this.pointCube.hide()
    //this.add( this.pointCube )

    /*let material = new THREE.LineBasicMaterial({ color: 0x0000ff } )
    let circleGeometry = new THREE.CircleGeometry( 10, 64 )
    //circleGeometry.vertices.shift()      
    this.pointCircle = new THREE.Mesh( circleGeometry, material )
    this.add( this.pointCircle )*/

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
    this.pointCircle = new CircleHelper({
      material : this.lineMaterial,
      highlightColor:this.highlightColor})
    //this.pointCircle.hide()
    //this.pointCircle.setRadius(2.5)
    //this.add( this.pointCircle )



    this.leaderLine = new LeaderLineHelper({
      text:this.text,
      radius:0,
      fontSize:this.fontSize,
      fontFace:this.fontFace, 
      textColor: this.textColor, 
      textBgColor:this.textBgColor,
      labelType : this.labelType,
      arrowColor:this.textColor,
      linesColor:this.lineColor,
      lineWidth:this.lineWidth,
      highlightColor:this.highlightColor,

      textBorder:"rectangle"
      })

    this.leaderLine.hide()
    this.add( this.leaderLine ) 
    
  }

  unset( ){
    this.pointCross.hide()
    //this.pointCircle.hide()
  }

  setPoint( point, object ){
    if(point) this.point = point
    if(object) this.object = object

    //point location cross
    this.pointCross.position.copy( this.point )
    this.pointCross.show()

    //this.pointCube.position.copy( this.point )
    //this.pointCircle.position.copy(this.point)
    //this.pointCircle.show()

    this.leaderLine.position.copy(this.point)
    this.leaderLine.show()
  }
  
}

export default NoteVisual

