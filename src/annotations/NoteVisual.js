import THREE from 'three'
import AnnotationHelper from "./AnnotationHelper"
import CrossHelper from "../CrossHelper"


/*
  Helper for basic notes (single point)
*/
class NoteVisual extends AnnotationHelper {
  constructor( options ) {
    const DEFAULTS = {
      crossColor:"#000",
    }
    
    let options = Object.assign({}, DEFAULTS, options) 
    super(options)

    //initialise internal sub objects
    this.pointCross = new CrossHelper({size:4.5,color:this.crossColor})
    this.pointCross.hide()
    this.add( this.pointCross )

    this.pointCube = new THREE.Mesh(new THREE.SphereGeometry(1,20,20), new THREE.MeshBasicMaterial({color:0xFF00FF}))
    //this.pointCube.hide()
    this.add( this.pointCube )
    
    
    this.point      = options.point!== undefined ? options.point : undefined
    this.object     = options.object!== undefined ? options.object : undefined
    
    if( options.point ) this.setPoint( this.point, this.object )
    
    this.setAsSelectionRoot( true )
  }
  
  unset( ){
    this.pointCross.hide()
  }

  setPoint( point, object ){
    if(point) this.point = point
    if(object) this.object = object

    //point location cross
    this.pointCross.position.copy( this.point )
    this.pointCross.show()

    this.pointCube.position.copy( this.point )
  }
  
}

export default NoteVisual

