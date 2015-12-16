import THREE from 'three'

import {computeBoundingBox} from '../meshTools/computeBounds'
import {computeCenterOfGravity} from '../meshTools/computeCenterOfGravity'

//from http://stackoverflow.com/questions/15761644/threejs-how-to-implement-zoomall-and-make-sure-a-given-box-fills-the-canvas-are
/**
 *  Zoom to object
 */
export default function zoomToFit ( object, camera, target ) {

  let bbox = computeBoundingBox(object)
  if (bbox.empty()) {
    return
  }
  let COG =  bbox.center()

  pointCameraTo(COG, target, camera)
  camera.lookAt(COG)

  let sphereSize   = bbox.size().length() * 0.5
  let distToCenter = sphereSize/Math.sin( Math.PI / 180.0 * camera.fov * 0.5)

  // move the camera backward 
  let vec = new THREE.Vector3()
  //compute vector from cam position to target
  vec.subVectors( camera.position, target )
  //set that vector's length to the distance to the center
  vec.setLength( distToCenter )
  //offset camera position by offset distance + target 
  camera.position.addVectors(  vec , target )
  camera.updateProjectionMatrix()
}

/**
 * point the current camera to the center
 * of the graphical object (zoom factor is not affected)
 *
 * the camera is moved in its  x,z plane so that the orientation 
 * is not affected either
 */
export function pointCameraTo (COG, target, camera) {
  // Refocus camera to the center of the new object
  let v = new THREE.Vector3()
  v.subVectors(COG,target)

  camera.position.addVectors(camera.position, v)
}

