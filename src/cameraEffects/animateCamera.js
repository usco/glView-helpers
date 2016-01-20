

export default function animateCamera(camera, duration, params){
  //{ pos:camTgt, tgt:camTgtTarget}
  let camPos       = camera.position.clone()
  let camTgt       = ( camera.target || new THREE.Vector3() ) .clone()

  let camPosTarget = params.pos
  let camTgtTarget = params.tgt

  //params = params || {starts:[],duration:0}
  //const duration = params.duration

  /*return params.starts.map(function(start, index){

    return new TWEEN.Tween( start )
      .to( camPosTarget , duration )
      .easing( params.easing[index] || TWEEN.Easing.Quadratic.In )
      .onUpdate( function () {
        camera.position.copy(camPos) 
      } )
      .start()
  })*/

  let tween = new TWEEN.Tween( camPos )
    .to( camPosTarget , duration )
    .easing( TWEEN.Easing.Quadratic.In )
    .onUpdate( function () {
      camera.position.copy(camPos);  
    } )
    .start()

  let tween2 = new TWEEN.Tween( camTgt )
    .to( camTgtTarget , duration )
    .easing( TWEEN.Easing.Quadratic.In )
    .onUpdate( function () {
      camera.target.copy(camTgt)
    } )
    .start()
}





  