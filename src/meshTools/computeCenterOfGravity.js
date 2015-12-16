
export default function computeCenterOfGravity (boundingBox) {

 return THREE.addVectors( boundingBox.min,boundingBox.max)
  .divideScalar(2)
}
