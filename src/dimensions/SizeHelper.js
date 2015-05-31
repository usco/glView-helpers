import THREE from 'three'
import BaseHelper from "../BaseHelper"
import LineHelper from "../LineHelper"
import CrossHelper from "../CrossHelper"
import {LabelHelperPlane, LabelHelper3d} from "../LabelHelper"
import {GizmoMaterial,GizmoLineMaterial} from "../GizmoMaterial"
/*
  Made of two main arrows, and two lines perpendicular to the main arrow, at both its ends
  If the VISUAL distance between start & end of the helper is too short to fit text + arrow:
   * arrows should be on the outside
   * if text does not fit either, offset it to the side
*/

//TODO: how to put items on the left instead of right, front instead of back etc
class SizeHelper extends BaseHelper {
  constructor( options ) {
    const DEFAULTS = {
      _position:new THREE.Vector3(),
      centerColor:"#F00",
      crossColor:"#F00",
      
      drawArrows: true,
      drawLeftArrow: true,
      drawRightArrow: true,
      arrowColor: "000",
      arrowsPlacement:'dynamic',//can be either, dynamic, inside, outside
      arrowHeadSize:2.0,
      arrowHeadWidth:0.8,
      arrowFlatten : 0.3,//by how much to flatten arrows along their "up axis"
      
      lineWidth: 1,//TODO: how to ? would require not using simple lines but strips
      //see ANGLE issue on windows platforms
      drawSideLines: true,
      sideLength:0,//length of the small lines perpendicular to the main arrows
      sideLengthExtra: 2,//how much sidelines should stick out
      sideLineColor: "000",
      sideLineSide: "front",
      
      drawLabel: true,
      labelPos:"center",
      labelType: "flat",//frontFacing or flat
      labelSpacingExtra : 0.1,
      fontSize: 10,
      fontFace: "Jura",
      fontWeight: "bold",
      fontStyle: "",
      textColor: "#000",
      textBgColor: "rgba(255, 255, 255, 0)",
      lengthAsLabel: true, //TODO: "length is too specific change that"
      text:"",
      textPrefix : "",//TODO: perhas a "textformat method would be better ??

      start: undefined,
      end: undefined,      
      up:  new THREE.Vector3(0,0,1),
      direction : undefined,//new THREE.Vector3(1,0,0),
      facingSide: new THREE.Vector3(0,1,0),//all placement computations are done relative to this one
      facingMode: "static",//can be static or dynamic
      length : 0,
    }
  
  this.DEFAULTS = DEFAULTS //keep defaults
  let options = Object.assign({}, DEFAULTS, options) 
  super(options)

  Object.assign(this, options)

  console.log("options",options)

  //FIXME: do this better
  this.axisAligned = false
  this.findGoodSide = true
  
  this.leftArrowPos  = new THREE.Vector3()
  this.rightArrowPos = new THREE.Vector3()
  this.leftArrowDir  = new THREE.Vector3()
  this.rightArrowDir = new THREE.Vector3()
  this.flatNormal    = new THREE.Vector3(0,0,1)
  this.labelPosition = new THREE.Vector3()
  this.offsetLeftArrowPos  = new THREE.Vector3()
  this.offsetRightArrowPos = new THREE.Vector3()
    
  this._setupVisuals()
  this._computeBasics()

  }
  
  /* method compute all the minimal parameters, to have a minimal viable
  display of size
   parameter's priortity is in descending order as follows:
    - start & end
    - lengh & direction
   you can provide either:
    - start & end
    - start & length & direction
    - end & length & direction
  */ 
  _computeBasics( ){
    //either use provided length parameter , or compute things based on start/end parameters
    let start   = this.start
    let end     = this.end 
  
    if(end && start)
    {
      let tmpV = end.clone().sub( start ) 
      this.length = tmpV.length()
      this.direction = tmpV.normalize()
    }
    else if(start && !end && this.direction && this.length){
      end = this.direction.clone().multiplyScalar( this.length ).add( start )
    }
    else if(end && !start && this.direction && this.length){
      start = this.direction.clone().negate().multiplyScalar( this.length ).add( end )
    }
    else if( this.direction && this.length )
    {
      start = this.direction.clone().multiplyScalar( -this.length/2).add( this.position )
      end   = this.direction.clone().multiplyScalar( this.length/2).add( this.position )
    }
    else{
      //throw new Error("No sufficient parameters provided to generate a SizeHelper")
      return
    }
  
    this.start = start
    this.end   = end
    //MID is literally the middle point between start & end, nothing more
    this.mid   = this.direction.clone().multiplyScalar( this.length/2 ).add( this.start )
    
    //the size of arrows (if they are drawn) is max half the total length between start & end
    this.arrowSize  = this.length / 2
    this.leftArrowDir  = this.direction.clone()
    this.rightArrowDir = this.direction.clone().negate()
    
    if(this.lengthAsLabel) this.text = this.length.toFixed(2)
    
     
    //HACK, for testing
    if( ( (Math.abs( this.direction.z) - 1) <= 0.0001) && this.direction.x == 0 && this.direction.y ==0 )
    {
      this.up = new THREE.Vector3(1, 0, 0)
    }
    
    let cross = this.direction.clone().cross( this.up )
    cross.normalize().multiplyScalar( this.sideLength )
    console.log("mid", this.mid,"cross", cross)
    
    /*let bla = [0,0,0]
    let axes = ["x","y","z"]
    axes.forEach( (axis, index) => {
      if(this.facingSide[axis] != 0)
      {
        bla[index] = cross[axis] * this.facingSide[axis]
      }
      else{
        bla[index] = cross[axis]
      }
    })
    cross = new THREE.Vector3().fromArray( bla )
    console.log("cross", cross)*/
    
    this.leftArrowPos = this.mid.clone().add( cross )
    this.rightArrowPos = this.mid.clone().add( cross )
    this.flatNormal = cross.clone()
    
    this.offsetMid   = this.mid.clone().add( cross.clone().setLength( this.sideLength ) )
    this.offsetStart = this.start.clone().add( cross.clone().setLength( this.sideLength ) )
    this.offsetEnd   = this.end.clone().add( cross.clone().setLength( this.sideLength ) )
    
    //compute all the arrow & label positioning details
    this._computeLabelAndArrowsOffsets()
    //all the basic are computed, configure visuals
    this._updateVisuals()
  }
  
  /* compute the placement for label & arrows
    determine positioning for the label/text:
    Different cases:
     - arrows pointing inwards:
      * if label + arrows fits between ends, put label between arrows
      * if label does not fit between ends
  */
  _computeLabelAndArrowsOffsets(){
    let sideLength  = this.sideLength
    let length      = this.length
    let labelPos    = this.labelPos
    let labelOrient = new THREE.Vector3(-1,0,1) 
    let labelHeight  = 0
    let labelLength  = 0
    let innerLength      = 0
    let innerLengthHalf  = 0
    let labelSpacingExtra = this.labelSpacingExtra 
    let arrowHeadSize     = this.arrowHeadSize
    let arrowHeadsLength  = this.arrowHeadSize *2
    let arrowSize         = this.arrowSize
    
    let offsetMid   = this.offsetMid
    let offsetStart = this.offsetStart
    let offsetEnd   = this.offsetEnd

    //generate invisible label/ text
    //this first one is used to get some labeling metrics, and is
    //not always displayed
    let label = new LabelHelperPlane({
      text:this.text,
      fontSize:this.fontSize,
      fontWeight: this.fontWeight,
      fontFace:this.fontFace,
      color:this.textColor,
      bgColor:this.textBgColor})
    label.position.copy( this.leftArrowPos )
    
    //calculate offset so that there is a hole between the two arrows to draw the label
    if(this.drawLabel){
      labelLength = label.textWidth + labelSpacingExtra * 2
      labelHeight = label.textHeight
    }
    
    innerLength = labelLength + arrowHeadsLength
    innerLengthHalf = innerLength / 2
    
    /*cases
      - no label : just arrows: 
        - arrows get placed OUTSIDE if size too small (dynamic & inside too)
      - label: 
        - label + labelBorder  + arrowHeads X2 need to fit between start & end
        - dynamic :
          * (labelLength + labelBorder  + arrowHeads X2) < length : do nothing  IE : length - (labelLength + labelBorder) > (arrowHeads X2)
          * (labelLength + labelBorder) < length but not arrows IE  0 < ( length - (labelLength + labelBorder)) < (arrowHeads X2)
          
    */
    let remLength = (length - labelLength)//remaining length (total - label )
    let roomForBoth  = (remLength > arrowHeadsLength)//fiting arrow + label is OK
    let roomForLabel = (remLength>0 && remLength < arrowHeadsLength)//fitting only label is OK
    let noRoom       = (remLength <0 ) // no room (in hell) to fit either label or arrows
    
    let actualPos = undefined//we collapse all possibilities to something simple
    
    if( this.arrowsPlacement == "dynamic" || this.arrowsPlacement == "inner" ){
      if(roomForBoth)//if the label + arrows would fit
      {
        this.arrowSize -= labelLength
        this.leftArrowPos.add( this.leftArrowDir.clone().normalize().setLength( labelLength/2 ) )
        this.rightArrowPos.add( this.rightArrowDir.clone().normalize().setLength( labelLength/2 ) )
      }
      if(noRoom || roomForLabel){
        
        this.arrowSize = Math.max(length/2,6)//we want arrows to be more than just arrowhead when we put it "outside"
        let arrowDist = length/2 + this.arrowSize
        
        //invert the direction of arrows , since we want them "OUTSIDE" of the start & end pointing "IN"
        this.leftArrowDir = this.direction.clone().negate()
        this.rightArrowDir = this.leftArrowDir.clone().negate()
        
        this.leftArrowPos.sub( this.leftArrowDir.clone().normalize().multiplyScalar( arrowDist ) )
        this.rightArrowPos.sub( this.rightArrowDir.clone().normalize().multiplyScalar( arrowDist ) )
      }
    }else if( this.arrowsPlacement == "outside" ){
      //put the arrows outside of measure, pointing "inwards" towards center
      this.arrowSize = Math.max(length/2,6)//we want arrows to be more than just arrowhead in all the cases
      let arrowDist = this.length/2 + this.arrowSize
    
      this.leftArrowDir = this.direction.clone().negate()
      this.rightArrowDir = this.leftArrowDir.clone().negate()
      
      this.leftArrowPos.sub( this.leftArrowDir.clone().normalize().multiplyScalar( arrowDist ) )
      this.rightArrowPos.sub( this.rightArrowDir.clone().normalize().multiplyScalar( arrowDist ) )
      
      if(!roomForLabel)
      {
        //this.offsetMid   = this.mid.clone().add( cross.clone().multiplyScalar( this.sideLength ) )
        //this.offsetStart = this.start.clone().add( cross.clone().multiplyScalar( this.sideLength ) )
        //this.offsetEnd   = this.end.clone().add( cross.clone().multiplyScalar( this.sideLength ) )
        //console.log("UH OH , this", this, "will not fit!!")
        //we want it "to the side" , aligned with the arrow, beyond the arrow head
        //let lengthOffset = this.length/2 + labelSpacingExtra + arrowHeadSize + labelLength
        let lengthOffset   = label.textWidth/4 + arrowHeadSize
        this.labelPosition = offsetStart.clone().add( this.leftArrowDir.clone().setLength(lengthOffset) )
        labelPos = "top"
      }
    }else{
       this.arrowSize -= labelHoleHalfSize
       this.leftArrowPos.add( this.leftArrowDir.clone().normalize().setLength( labelHoleHalfSize ) )
       this.rightArrowPos.add( this.rightArrowDir.clone().normalize().setLength( labelHoleHalfSize ) )
    }
    
    //offset the label based on centered/top/bottom setting
    switch(labelPos)
    {
       case "center":
        this.textHeightOffset = new THREE.Vector3()
       break
       case "top":
         this.textHeightOffset = new THREE.Vector3( ).crossVectors( this.up, this.direction ).setLength( labelHeight/2 )
       break
       case "bottom":
        this.textHeightOffset = new THREE.Vector3( ).crossVectors( this.up, this.direction ).setLength( labelHeight ).negate()
       break
    }
    
  }
  
  _setupVisuals(){
    //materials
    this.arrowLineMaterial = new GizmoLineMaterial({color:this.arrowColor, linewidth:this.lineWidth, linecap:"miter"})
    this.arrowConeMaterial = new GizmoMaterial({color:this.arrowColor})
    
    //arrows
    let sideLength = this.sideLength
    let leftArrowDir,rightArrowDir, leftArrowPos, rightArrowPos,
      arrowHeadSize, arrowSize,
      leftArrowHeadSize, leftArrowHeadWidth, rightArrowHeadSize, 
      rightArrowHeadWidth
    
    leftArrowDir  = this.leftArrowDir
    rightArrowDir = this.rightArrowDir
    leftArrowPos  = this.leftArrowPos
    rightArrowPos = this.rightArrowPos
    
    arrowHeadSize = this.arrowHeadSize
    arrowSize     = this.arrowSize 
  
    leftArrowHeadSize = rightArrowHeadSize = this.arrowHeadSize 
    leftArrowHeadWidth= rightArrowHeadWidth = this.arrowHeadWidth
  
    //direction, origin, length, color, headLength, headRadius, headColor
    this.mainArrowLeft = new THREE.ArrowHelper( leftArrowDir, leftArrowPos, arrowSize, 
      this.arrowColor, leftArrowHeadSize, leftArrowHeadWidth)
    this.mainArrowRight = new THREE.ArrowHelper(rightArrowDir, rightArrowPos, arrowSize, 
      this.arrowColor, rightArrowHeadSize, rightArrowHeadWidth)
      
    if(!this.drawLeftArrow) this.mainArrowLeft.cone.visible = false
    if(!this.drawRightArrow) this.mainArrowRight.cone.visible = false
    
    this.mainArrowLeft.line.material = this.arrowLineMaterial
    this.mainArrowRight.line.material = this.arrowLineMaterial
    
    this.mainArrowLeft.cone.material = this.arrowConeMaterial
    this.mainArrowRight.cone.material = this.arrowConeMaterial
    
    //Flaten in the UP direction(s) , not just z
    let arrowFlatten = this.arrowFlatten
    let arrowFlatScale = new THREE.Vector3(arrowFlatten, arrowFlatten , arrowFlatten)
    arrowFlatScale = new THREE.Vector3().multiplyVectors( this.up, arrowFlatScale )
    let axes = ["x","y","z"]
    axes.forEach( (axis, index) => {
      if(arrowFlatScale[axis] === 0 ) arrowFlatScale[axis] = 1
    })
    this.mainArrowLeft.scale.copy( arrowFlatScale )
    this.mainArrowRight.scale.copy( arrowFlatScale )
    
    this.add( this.mainArrowLeft )
    this.add( this.mainArrowRight )
    //this.add( this.dirDebugArrow )
    
    this.mainArrowRight.renderDepth = this.mainArrowLeft.renderDepth = 1e20
    this.mainArrowRight.depthTest   = this.mainArrowLeft.depthTest = false
    this.mainArrowRight.depthWrite  = this.mainArrowLeft.depthWrite = false
    //this.dirDebugArrow.depthWrite  = this.dirDebugArrow.depthTest = false
    
    ////////sidelines
    this.leftSideLine  = new LineHelper( {color:this.arrowColor} ) 
    this.rightSideLine = new LineHelper( {color:this.arrowColor} )
    
    this.add( this.rightSideLine )
    this.add( this.leftSideLine )
    
    ////////labels
    switch(this.labelType)
    {
      case "flat":
        this.label = new LabelHelperPlane({
          text:this.text,
          fontSize:this.fontSize, 
          fontFace:this.fontFace,
          fontWeight: this.fontWeight,
          fontStyle: this.fontStyle,
          color:this.textColor, 
          background:(this.textBgColor!=null),
          bgColor:this.textBgColor})
      break
      case "frontFacing":
        this.label = new LabelHelper3d({
          text:this.text,
          fontSize:this.fontSize,
          fontFace:this.fontFace,
          fontWeight: this.fontWeight,
          fontStyle: this.fontStyle,
          color:this.textColor, 
          bgColor:this.textBgColor})
      break
    }
    this.label.position.copy( this.labelPosition )
    this.add( this.label )
    
    if( !this.drawLabel )
    {
      this.label.hide()
    }else
    {this.label.show()}
    
    //debug helpers
    this.debugHelpers = new BaseHelper()
    
    this.directionDebugHelper  = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(), 15, 0XFF0000)
    this.upVectorDebugHelper   = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(), 15, 0X0000FF)
    this.startDebugHelper      = new CrossHelper({color:0xFF0000})
    this.midDebugHelper        = new CrossHelper({color:0x0000FF})
    this.endDebugHelper        = new CrossHelper({color:0x00FF00})
    
    this.offsetStartDebugHelper      = new CrossHelper({color:0xFF0000})
    this.offsetMidDebugHelper        = new CrossHelper({color:0x0000FF})
    this.offsetEndDebugHelper        = new CrossHelper({color:0x00FF00})

    this.debugHelpers.add( this.directionDebugHelper )
    this.debugHelpers.add( this.upVectorDebugHelper )
    this.debugHelpers.add( this.startDebugHelper )
    this.debugHelpers.add( this.midDebugHelper )
    this.debugHelpers.add( this.endDebugHelper )
    this.debugHelpers.add( this.offsetStartDebugHelper )
    this.debugHelpers.add( this.offsetMidDebugHelper )
    this.debugHelpers.add( this.offsetEndDebugHelper )
    
    this.add( this.debugHelpers )
    if( ! this.debug )
    {
      this.debugHelpers.hide()
    }else
    {
      this.debugHelpers.show()
    }
  }
  
  _updateVisuals(){
    let leftArrowDir,rightArrowDir, leftArrowPos, rightArrowPos,
      arrowHeadSize, arrowSize,
      leftArrowHeadSize, leftArrowHeadWidth, rightArrowHeadSize, 
      rightArrowHeadWidth
    
    leftArrowDir  = this.leftArrowDir
    rightArrowDir = this.rightArrowDir
    leftArrowPos  = this.leftArrowPos
    rightArrowPos = this.rightArrowPos
    
    arrowHeadSize = this.arrowHeadSize
    arrowSize     = this.arrowSize 
  
    this.mainArrowLeft.setLength( arrowSize, this.arrowHeadSize, this.arrowHeadWidth )
    this.mainArrowLeft.setDirection( leftArrowDir )
    this.mainArrowLeft.position.copy( leftArrowPos )
    
    this.mainArrowRight.setLength( arrowSize, this.arrowHeadSize, this.arrowHeadWidth )
    this.mainArrowRight.setDirection( rightArrowDir )
    this.mainArrowRight.position.copy( rightArrowPos )
    
    //Flaten arrows the UP direction(s)
    let arrowFlatten = this.arrowFlatten
    let arrowFlatScale = new THREE.Vector3( arrowFlatten, arrowFlatten , arrowFlatten )
    arrowFlatScale = new THREE.Vector3().multiplyVectors( this.up, arrowFlatScale )
    let axes = ["x","y","z"]
    axes.forEach( (axis, index) => {
      if(arrowFlatScale[axis] === 0 ) arrowFlatScale[axis] = 1
    })
    this.mainArrowLeft.scale.copy( arrowFlatScale )
    this.mainArrowRight.scale.copy( arrowFlatScale )
    
    ///sidelines
    let sideLength      = this.sideLength
    let sideLengthExtra = this.sideLengthExtra
    
    let sideLineV         = this.flatNormal.clone().setLength( sideLength+sideLengthExtra )
    
    let lSideLineStart     = this.start.clone()
    let lSideLineEnd       = lSideLineStart.clone().add( sideLineV )
    
    let rSideLineStart    = this.end.clone()
    let rSideLineEnd      = rSideLineStart.clone().add( sideLineV )
    //this.end.clone().sub( this.start )
    
    this.leftSideLine.setStart( lSideLineStart )
    this.leftSideLine.setEnd( lSideLineEnd )
    
    this.rightSideLine.setStart( rSideLineStart )
    this.rightSideLine.setEnd( rSideLineEnd )
    
    ///label
    if( !this.drawLabel ){
      this.label.hide()
    }else{ this.label.show()}
    this.label.setText(this.text)    
    this.label.position.copy( this.labelPosition.clone().add( this.textHeightOffset ) )
    
    //make the label face the correct way
    //flatNormal is a custom "up" vector (the way the label / arrows should face)

    //let labelDefaultOrientation = new THREE.Vector3(-1,0,1) 
    //let quaternion = new THREE.Quaternion()
    //quaternion.setFromUnitVectors ( labelDefaultOrientation, this.direction.clone() )
    
    //from http://stackoverflow.com/questions/15139649/three-js-two-points-one-cylinder-align-issue
    let oldPos = this.label.position.clone()
    sideLength      = this.sideLength
    sideLineV       = this.flatNormal.clone().setLength( sideLength )
    lSideLineStart     = this.start.clone()
    lSideLineEnd       = lSideLineStart.clone().add( sideLineV )
    rSideLineStart    = this.end.clone()
    rSideLineEnd      = rSideLineStart.clone().add( sideLineV )
    
    let orientation = new THREE.Matrix4()//a new orientation matrix to offset pivot
    let offsetRotation = new THREE.Matrix4()//a matrix to fix pivot rotation
    let offsetPosition = new THREE.Matrix4()//a matrix to fix pivot position
    let up = this.up//new THREE.Vector3(0,1,0)//this.up
    let HALF_PI = +Math.PI * .5
    orientation.lookAt( lSideLineStart, lSideLineEnd, up )//look at destination
    offsetRotation.makeRotationX(HALF_PI)//rotate 90 degs on X
    orientation.multiply(offsetRotation)//combine orientation with rotation transformations

    
    let newOrient = new THREE.Euler().setFromRotationMatrix( orientation )
    
    function isEulerAlmostEqual( euler, otherEuler, precision=0.00001 ){
      /*return (
      ( Math.abs( euler._x - otherEuler._x) < precision ) && 
      ( Math.abs( euler._y - otherEuler._y) < precision ) && 
      ( Math.abs( euler._z - otherEuler._z) < precision ) && 
      ( euler._order === otherEuler._order ) )
      ||
      (
       )*/
       return ( euler._x === otherEuler._x ) && ( euler._y === -otherEuler._y ) && ( euler._order === otherEuler._order ) 
    }
    //if( prev.equals( this.label.rotation ) )//issues with precision
    if( isEulerAlmostEqual( newOrient, this.label.rotation ) )
    {
      console.log("already there bud")
    }
    else
    {
       this.label.applyMatrix(orientation)
       this.label.position.copy( oldPos )
       //this.label.position.copy( this.mid )
    }
    
    //FIXME: HACK
    if(this.facingSide.x == -1){
      console.log("ughh")
      //offsetRotation.makeRotationZ( Math.PI )
      //this.label.rotateOnAxis( new THREE.Vector3(0,0,1), Math.PI )
    }
    
    //debug helpers
    this.directionDebugHelper.setDirection( this.direction )
    this.upVectorDebugHelper.setDirection( this.up )
    this.startDebugHelper.position.copy( this.start )
    this.midDebugHelper.position.copy( this.mid )
    this.endDebugHelper.position.copy( this.end )
    
    this.offsetStartDebugHelper.position.copy( this.offsetStart )
    this.offsetMidDebugHelper.position.copy( this.offsetMid )
    this.offsetEndDebugHelper.position.copy( this.offsetEnd )
    
    if( ! this.debug )
    {
      this.debugHelpers.hide()//not working ??
    }else
    {
      this.debugHelpers.show()
    }
    
    //FIXME: something weird is going on, we have to remove the debug helpers, cannot
    //hide them ?? 
    //this.remove( this.debugHelpers )
  }

  //setters
  /* set all parameters from options */
  setFromParams( options ){
    const defaults ={
      start:undefined,
      end:undefined,
      up:new THREE.Vector3(0,0,1) 
    }

    this.start= undefined
    this.end=undefined    
    this.up=  new THREE.Vector3(0,0,1)
    this.direction =undefined//new THREE.Vector3(1,0,0),
    this.facingSide= new THREE.Vector3(0,1,0)//all placement computations are done relative to this one
  
    this.labelOriented = false
    
    this.label.position.set(0,0,0)
    this.label.scale.set(1,1,1)
    this.label.rotation.set(0,0,0)
    this.label.updateMatrix()
  
    Object.assign(this, options)
    
    this._computeBasics()
  }
  
  setUp( up ){
    this.up = up !== undefined ? up : new THREE.Vector3(0,0,1)
    this._computeBasics()
  }

  setDirection( direction ){
     this.direction = direction || new THREE.Vector3(1,0,0)
     this._computeBasics()
  }

  setLength( length ){
    /*this.length = length !== undefined ? length : 10
    
    this.start = this.direction.clone().multiplyScalar( -this.length/2).add( this._position )
    this.end   = this.direction.clone().multiplyScalar( this.length/2).add( this._position )
   
    this._recomputeMidDir()  */
  }

  setSideLength( sideLength ){
    this.sideLength = sideLength !== undefined ? sideLength : 0  
    this._computeBasics()
  } 

  setText( text ){
    this.text = text !== undefined ? text : ""
    this._computeBasics()
  } 

  setStart( start ){
    this.start = start || new THREE.Vector3()
    this._computeBasics()
  }
    
  setEnd( end ){
    this.end = end || new THREE.Vector3()
    this._computeBasics()
  } 

  setFacingSide( facingSide ){
    this.facingSide = facingSide || new THREE.Vector3()
    this._computeBasics()
  }
  
}

export default SizeHelper

