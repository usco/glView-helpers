import BaseOutline from "./BaseOutline"
import BaseHelper from "../BaseHelper"
import Box3C      from "../Box3C"
import SizeHelper from "./SizeHelper"

let ObjectDimensionsHelper = function (options) {
  BaseHelper.call( this );
  let options = options || {};
  let color = this.color = options.color || 0x000000;
  let mesh = options.mesh || this.parent || null;
  
  this.textBgColor= options.textBgColor!== undefined ? options.textBgColor : "#fff";
  this.textColor  = options.textColor!== undefined ? options.textColor : "#000";
  this.labelType  = options.labelType!== undefined ? options.labelType : "flat";
  this.sideLength = options.sideLength!== undefined ? options.sideLength : 10; 
  
  this.textBgColor = "#f5f5f5";//"rgba(255, 255, 255, 0)"
  this.textColor = "#ff0077";//options.textBgColor;
}

ObjectDimensionsHelper.prototype = Object.create( BaseHelper.prototype );
ObjectDimensionsHelper.prototype.constructor = ObjectDimensionsHelper;


ObjectDimensionsHelper.prototype.attach = function(mesh){
  let color = this.color;
  let mesh = this.mesh = mesh;
  let lineMat = new THREE.MeshBasicMaterial({color: color, wireframe: true, shading:THREE.FlatShading});
  /*mesh.updateMatrixWorld();
  let matrixWorld = new THREE.Vector3();
  matrixWorld.setFromMatrixPosition( mesh.matrixWorld );
  this.position.copy( matrixWorld );*/

  let dims   = this.getBounds(mesh);
  let length = this.length = dims[0];
  let width  = this.width  = dims[1];
  let height = this.height = dims[2];
  
  let delta = this.computeMiddlePoint(mesh);
  
  //console.log("w",width,"l",length,"h",height,delta);
  
  let baseCubeGeom = new THREE.BoxGeometry(this.length, this.width,this.height)
  this.meshBoundingBox = new THREE.Mesh(baseCubeGeom,new THREE.MeshBasicMaterial({wireframe:true,color:0xff0000}))
  //this.add( this.meshBoundingBox )

  this.baseOutline = new BaseOutline(this.length, this.width, delta);
  this.add( this.baseOutline );

  let widthArrowPos = new THREE.Vector3(delta.x+this.length/2,delta.y,delta.z-this.height/2); 
  let lengthArrowPos = new THREE.Vector3( delta.x, delta.y+this.width/2, delta.z-this.height/2)
  let heightArrowPos = new THREE.Vector3( delta.x-this.length/2,delta.y+this.width/2,delta.z)
  //console.log("width", this.width, "length", this.length, "height", this.height,"delta",delta, "widthArrowPos", widthArrowPos)
  let sideLength = this.sideLength;
  
  //length, sideLength, position, direction, color, text, textSize,
  this.widthArrow  = new SizeHelper( {length:this.width,sideLength:sideLength,
  direction:new THREE.Vector3(0,1,0), 
  textBgColor:this.textBgColor, textColor:this.textColor, arrowColor: this.textColor, sideLineColor:this.textColor, labelType:this.labelType  });
  
  this.lengthArrow = new SizeHelper( {length:this.length,sideLength:sideLength,
  direction:new THREE.Vector3(-1,0,0), 
  textBgColor:this.textBgColor, textColor:this.textColor, arrowColor: this.textColor, sideLineColor:this.textColor, labelType:this.labelType  });
  
  this.heightArrow = new SizeHelper( {length:this.height,sideLength:sideLength,
  direction:new THREE.Vector3(0,0,1), 
  textBgColor:this.textBgColor, textColor:this.textColor,arrowColor: this.textColor, sideLineColor:this.textColor, labelType:this.labelType });
  
  this.lengthArrow.position.copy( lengthArrowPos );
  this.widthArrow.position.copy( widthArrowPos );
  this.heightArrow.position.copy( heightArrowPos );
  
  this.arrows = new THREE.Object3D();
  this.arrows.add( this.widthArrow );
  this.arrows.add( this.lengthArrow );
  this.arrows.add( this.heightArrow );
  
  this.add( this.arrows );
  
  this.objectOriginalPosition = this.mesh.position.clone();
  let offsetPosition = this.objectOriginalPosition.clone().sub(
    new THREE.Vector3(0,0,this.height/2 ) );
  this.position.copy( offsetPosition );
}

ObjectDimensionsHelper.prototype.detach = function(mesh){
  this.mesh = null;
  //this.remove( this.meshBoundingBox );
  this.remove( this.baseOutline );
  this.remove( this.arrows );
  
  this.objectOriginalPosition = new THREE.Vector3();
  this.position.copy( new THREE.Vector3() );
}

ObjectDimensionsHelper.prototype.update = function(){
  //FIXME: VERY costly, needs optimising : is all this needed all the time ?
  let foo = this.mesh.position.clone().sub( this.objectOriginalPosition );
  this.position.add( foo );
  this.objectOriginalPosition = this.mesh.position.clone();
  
  //check if scale update is needed
 let dims = this.getBounds(this.mesh);
 if( this.length != dims[0] || this.width != dims[1] || this.height != dims[2] )
 {
    let mesh = this.mesh;
    this.width  = dims[1];
    this.length = dims[0];
    this.height = dims[2];
    
    //update base outline
    this.baseOutline.setLength( this.length );
    this.baseOutline.setWidth( this.width );
    
    let midPoint = this.computeMiddlePoint(mesh);
    let lengthArrowPos = new THREE.Vector3( midPoint.x, midPoint.y+this.width/2, midPoint.z-this.height/2 );
    let widthArrowPos = new THREE.Vector3( midPoint.x+this.length/2, midPoint.y, midPoint.z-this.height/2 ); 
    let heightArrowPos = new THREE.Vector3( midPoint.x-this.length/2, midPoint.y+this.width/2, midPoint.z );

    this.lengthArrow.setLength( this.length );
    this.widthArrow.setLength( this.width );
    this.heightArrow.setLength( this.height );

    this.lengthArrow.position.copy( lengthArrowPos );
    this.widthArrow.position.copy( widthArrowPos );
    this.heightArrow.position.copy( heightArrowPos );
    
    this.baseOutline.position.z = midPoint.z-this.height/2;
 }
  
}

ObjectDimensionsHelper.prototype.computeMiddlePoint=function(mesh)
{
  let middle  = new THREE.Vector3()
  middle.x  = ( mesh.boundingBox.max.x + mesh.boundingBox.min.x ) / 2;
  middle.y  = ( mesh.boundingBox.max.y + mesh.boundingBox.min.y ) / 2;
  middle.z  = ( mesh.boundingBox.max.z + mesh.boundingBox.min.z ) / 2;
  //console.log("mid",geometry.boundingBox.max.z,geometry.boundingBox.min.z, geometry.boundingBox.max.z+geometry.boundingBox.min.z)
  return middle;
}

ObjectDimensionsHelper.prototype.getBounds=function(mesh)
{
  //console.log("gna");
  let bbox = new Box3C().setFromObject( mesh ); //new THREE.Box3().setFromObject( mesh );
  //FIXME: needs to ignore any helpers 
  //in the hierarchy

  let length = ( (bbox.max.x-bbox.min.x).toFixed(2) )/1; // division by one to coerce to number
  let width  = ( (bbox.max.y-bbox.min.y).toFixed(2) )/1;
  let height = ( (bbox.max.z-bbox.min.z).toFixed(2) )/1;

  return [length,width, height];
}

module.exports = ObjectDimensionsHelper;
          
