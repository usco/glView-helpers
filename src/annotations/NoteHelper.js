import THREE from 'three'
import AnnotationHelper from "./AnnotationHelper"
import CrossHelper from "../CrossHelper"


/*
  Helper for basic notes (single point)
*/
class NoteHelper extends AnnotationHelper {
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
  }
  
}

export default NoteHelper

