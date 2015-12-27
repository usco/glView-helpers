import THREE from "three"

export default function resizeMesh( object, minSize, maxSize )
{  
  let minSize = minSize || 0.2
  let maxSize = maxSize || 500
  //if(!object.boundingSphere) computeObject3DBoundingSphere( object );
  //FIXME: bsphere can be present but with a radius == infinity etc
  computeObject3DBoundingSphere( object )
  
  let size = object.boundingSphere.radius
  if( size < minSize)
  {
    let ratio = object.boundingSphere.radius/minSize
    let scaling = 1/ratio
    object.applyMatrix( new THREE.Matrix4().makeScale( scaling, scaling, scaling ) )
  }
  else if(size > maxSize)
  {
    let ratio = object.boundingSphere.radius/maxSize
    let scaling = 1/ratio
    object.applyMatrix( new THREE.Matrix4().makeScale( scaling, scaling, scaling ) )
  }

}


