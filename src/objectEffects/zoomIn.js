import THREE from 'three'
import TWEEN from 'tween.js'
import assign from 'fast.js/object/assign'//faster object.assign


export default function zoomIn( object, camera, options ) {
  
  const defaults = {
    position     : undefined//to force a given "point " vector
    ,orientation : undefined//to force a given "look at " vector
    ,distance    : undefined
    ,zoomTime    : undefined
    ,precision   : 0.001
  }
  

  if(!object) return
  if(!camera) return 

  let {position,orientation,distance,zoomTime,precision} = assign({},defaults,options)
  console.log("ZoomInOnObject", object,options)

  //var scope = this;//TODO: this is temporary, until this "effect" is an object

  if(!position){
    distance = object.boundingSphere.radius*distance
    position = object.position.clone()
  }else{
    distance = position.clone().sub( object.position ).length() * distance * 2 
  }
  
  let camPos       = camera.position.clone()
  let camTgt       = ( camera.target || new THREE.Vector3() ) .clone()
  let camTgtTarget = position.clone()
  let camPosTarget = camera.position.clone().sub( position ) 
  
  //camera.target.copy( object.position );
  //determin camera "look-at" vector
  let  camLookatVector = new THREE.Vector3( 0, 0, 1 )
  camLookatVector.applyQuaternion( camera.quaternion )
  camLookatVector.normalize()
  camLookatVector.multiplyScalar( distance )
  camLookatVector = position.clone().add( camLookatVector )
  
  camPosTarget = camLookatVector
  
  //Simply using vector.equals( otherVector) is not good enough 
  if(Math.abs(camPos.x - camPosTarget.x)<= precision &&
   (Math.abs(camPos.y - camPosTarget.y)<= precision) &&
   (Math.abs(camPos.z - camPosTarget.z)<= precision) )
  {
    //already at target, do nothing
    return
  }   
  let tween = new TWEEN.Tween( camPos )
    .to( camPosTarget , zoomTime )
    .easing( TWEEN.Easing.Quadratic.In )
    .onUpdate( function () {
      camera.position.copy(camPos);  
    } )
    .start()

  let tween2 = new TWEEN.Tween( camTgt )
    .to( camTgtTarget , zoomTime )
    .easing( TWEEN.Easing.Quadratic.In )
    .onUpdate( function () {
      camera.target.copy(camTgt)
    } )
    .start()
    //tween2.chain( tween );
    //tween2.start();
}


