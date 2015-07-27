import THREE from 'three'
import AnnotationVisual from "./AnnotationVisual"
import SizeHelper from "../dimensions/SizeHelper"
import CrossHelper from "../CrossHelper"

import {getTargetBoundsData} from "./utils"

class DistanceVisual extends AnnotationVisual {
  constructor( options ) {
  
    const DEFAULTS = {
      crossSize: 3,
      crossColor: "#000",
      
      distance:undefined,
      start:undefined,
      startObject:undefined,
      end: undefined,
      endObject: undefined
    }
    
    options = Object.assign({}, DEFAULTS, options) 
    
    super( options )    
    Object.assign(this, options)
  
    //initialise internal sub objects
    this._setupVisuals()
    this._computeBasics()
   
    this.setAsSelectionRoot( true )
  }

    /*configure all the basic visuals of this helper*/
  _setupVisuals(){
    this.startCross = new CrossHelper({size:this.crossSize,color:this.crossColor})
    this.startCross.hide()
    this.add( this.startCross )

    this.endCross = new CrossHelper({size:this.crossSize,color:this.crossColor})
    this.endCross.hide()
    this.add( this.endCross )
      
    this.sizeArrow = new SizeHelper( { 
      lineWidth:this.lineWidth,
      textColor:this.textColor, 
      textBgColor:this.textBgColor, 
      fontSize:this.fontSize,
      fontFace:this.fontFace,
      labelType:this.labelType,
      arrowColor: this.arrowColor,
      sideLength:this.sideLength,//6
      sideLineColor:this.arrowColor,
      sideLineSide:"back"} )
      
    this.sizeArrow.hide()
    this.add( this.sizeArrow )
  }
  
  _computeBasics(){
    let start          = this.start
    let end            = this.end
    let startObject    = this.startObject
    let endObject      = this.endObject
    
    if( ! start || ! end || ! startObject || ! endObject ) return
    
    let endToStart = end.clone().sub( start )
    this.distance = endToStart.length()
    
    try{
      let midPoint = endToStart.divideScalar( 2 ).add( start )
      this._putSide = getTargetBoundsData(startObject, midPoint)
    }catch(error){
      console.error(error)
    }
    
    //all done, now update the visuals
    this._updateVisuals()
  }
    
  _updateVisuals(){
    console.log("this._putSide",this._putSide)
    this.sizeArrow.setFromParams( {
      start:this.start,
      end:this.end,
      debug:true
      //facingSide:new THREE.Vector3(0,0,1)
      //facingSide:this._putSide,
    })

    this.sizeArrow.show()
    this.startCross.show()
    this.endCross.show()
    
    this.startCross.position.copy( this.start )
    this.endCross.position.copy( this.end )
  }
  
  /*start: vector3D
  object: optional : on which object is the start point
  */
  setStart( start, object )
  {
    if(!start) return
    this.start = start
    if( object) this.startObject = object
    object = this.startObject
    //console.log("setting start",start, object, object.worldToLocal(start.clone()) )
    
    this.startCross.position.copy( this.start )
    this.sizeArrow.setStart( this.start )
  }

  setEnd( end, object )
  {
    if(!end) return
    this.end = end
    if( object) this.endObject = object
    object = this.endObject
     
    this.distance = end.clone().sub(this.start).length()

    this.endCross.position.copy( this.end )
    this.endCross.show()
    
    this.sizeArrow.setEnd( this.end)
    this.sizeArrow.show()
  }

  unset()
  {
    this.startCross.hide()
    this.sizeArrow.hide()
    
    this._endHook = null
    this._startHook = null
  }

}



class DistanceVisual__ extends AnnotationVisual {
  constructor( options ) {
  
    const DEFAULTS = {
      crossSize: 3,
      crossColor: "#000",
      
      distance:undefined,
      start:undefined,
      startObject:undefined,
      end: undefined,
      endObject: undefined
    }
    
    options = Object.assign({}, DEFAULTS, options) 
    
    super( options )    
    Object.assign(this, options)
  
    //initialise internal sub objects
    this._setupVisuals()
    this._computeBasics()
   
    this.updatable = false
    this.setAsSelectionRoot( true )
    //FIXME: do this in a more coherent way
    this._setName()
  }
  
  
  //getters & setters
  /*get start () {
    return this._start
  }
  set start (val) {
    console.log("setting start",val)
    let start = this._start = val
    this._computeStartHooks()
    
    if(!this.startCross ) return
    this.startCross.position.copy( this.start )
    this.startCross.show()
  }
  
  get startObject () {
    return this._startObject
  }
  set startObject (val) {
    console.log("setting start object",val)
    let startObject = this._startObject = val
    this._computeStartHooks()
  }
  
  get end() {
    return this._end
  }
  set end(val) {
    console.log("setting end",val)
    let start = this._end = val
    this._computeEndHooks()
  }
  
  get endObject () {
    return this._endObject
  }
  set endObject (val) {
    console.log("setting end object",val)
    let endObject = this._endObject = val
    this._computeEndHooks()
  }

  _computeStartHooks(){
  
    if(!this.start || !this.startObject) return
    this.curStartObjectPos = this.startObject.position.clone()
    
    this._startOffset = this.start.clone().sub( this.curStartObjectPos )
    if(!this._startHook){
      this._startHook = new THREE.Object3D()
      this._startHook.position.copy( this.start.clone().sub( this.startObject.position ) )//object.worldToLocal(this.start) )
      this.startObject.add( this._startHook )
    }
  }
  
  _computeEndHooks(){
    if(!this.end || !this.endObject) return
    
    //FIXME: experimental
    this.curEndObjectPos = this.endObject.position.clone()

    this._endOffset = this.end.clone().sub( this.curEndObjectPos )
    
    if(!this._endHook){
      this._endHook = new THREE.Object3D()
      this._endHook.position.copy( this.end.clone().sub( this.endObject.position ) )//object.worldToLocal(this.end) )
      this.endObject.add( this._endHook )
    }
    
    this._computeBasics()
  }*/
  
  _computeBasics(){
    let start          = this.start
    let end            = this.end
    let startObject    = this.startObject
    let endObject      = this.endObject
    
    if( ! start || ! end || ! startObject || ! endObject ) return
    
    let endToStart = end.clone().sub( start )
    this.distance = endToStart.length()
    
    try{
      let midPoint = endToStart.divideScalar( 2 ).add( start )
      this._putSide = this.getTargetBoundsData(startObject, midPoint)
    }catch(error){
      console.error(error)
    }
    
    //all done, now update the visuals
    this._updateVisuals()
    
    this.sizeArrow.show()
    this.startCross.show()
  }
  
  /*configure all the basic visuals of this helper*/
  _setupVisuals(){
    this.startCross = new CrossHelper({size:this.crossSize,color:this.crossColor})
    this.startCross.hide()
    this.add( this.startCross )
      
    this.sizeArrow = new SizeHelper( { 
      textColor:this.textColor, 
      textBgColor:this.textBgColor, 
      fontSize:this.fontSize,
      fontFace:this.fontFace,
      labelType:this.labelType,
      arrowColor: this.arrowColor,
      sideLength:this.sideLength,//6
      sideLineColor:this.arrowColor,
      sideLineSide:"back"} )
      
    this.sizeArrow.hide()
    this.add( this.sizeArrow )
  }
  
  _updateVisuals(){
    this.sizeArrow.setFromParams( {
      start:this.start,
      end:this.end,
      facingSide:this._putSide,
    })
    
    this.startCross.position.copy( this.start )
  }
  
  /*start: vector3D
  object: optional : on which object is the start point
  */
  setStart( start, object )
  {
    if(!start) return
    this.start = start
    if( object) this.startObject = object
    object = this.startObject
    //console.log("setting start",start, object, object.worldToLocal(start.clone()) )
    
    //FIXME: experimental
    this.curStartObjectPos = object.position.clone()
    
    this._startOffset = start.clone().sub( this.curStartObjectPos )
    if(!this._startHook){
      this._startHook = new THREE.Object3D()
      this._startHook.position.copy( this.start.clone().sub( object.position ) )//object.worldToLocal(this.start) )
      object.add( this._startHook )
    }
    
    this.startCross.position.copy( this.start )
    this.sizeArrow.setStart( this.start )
  }

  setEnd( end, object )
  {
    if(!end) return
    this.end = end
    if( object) this.endObject = object
    
    object = this.endObject
    
    //FIXME: experimental
    this.curEndObjectPos = object.position.clone()

    this._endOffset = end.clone().sub( this.curEndObjectPos )
    
    if(!this._endHook){
      this._endHook = new THREE.Object3D()
      this._endHook.position.copy( this.end.clone().sub( object.position ) )//object.worldToLocal(this.end) )
      object.add( this._endHook )
    }
    
    this.distance = end.clone().sub(this.start).length()
    
    this.sizeArrow.setEnd( this.end)
    this.sizeArrow.show()
  }

  unset( )
  {
    this.startCross.hide()
    this.sizeArrow.hide()
    
    this._endHook = null
    this._startHook = null
  }


  
}

export default DistanceVisual


  /*brute force update method, to update the star & end positions
  when the objects they are attached to change (position, rotation,scale)
  update( ){
    return
    //TODO: find a way to only call this when needed
    if(!this.visible) return
    if(!this.updatable) return
    let changed = false
    
    this.startObject.updateMatrix()
    this.startObject.updateMatrixWorld()
    this.endObject.updateMatrix()
    this.endObject.updateMatrixWorld()
    
    this.setStart( this.startObject.localToWorld( this._startHook.position.clone() ) )
    this.setEnd( this.endObject.localToWorld( this._endHook.position.clone()) )
    
    this._setName()
  }*/
