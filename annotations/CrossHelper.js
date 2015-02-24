/*
 id: inner diameter : blank space at center of cross
*/
CrossHelper = function(options)
{
  BaseHelper.call( this );
  
  var options = options || {}

  var position = options.position || new THREE.Vector3();
  var direction = this.direction = options.direction || new THREE.Vector3();
  this.color = options.color || 0x000000 ;
  var opacity = this.opacity = options.opacity || 0.8;
  var size = this.size = options.size || 10;
  var id = this.innerDia = options.id || 0;

  
  var offsetPos = size/2 + id/2;
  //starting point cross
  var startCrossGeometry = new THREE.Geometry();
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, -offsetPos, 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, -id/2, 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, offsetPos , 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( 0, id/2 , 0 ) );
  
  startCrossGeometry.vertices.push( new THREE.Vector3( -offsetPos, 0, 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( -id/2, 0, 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( offsetPos, 0 , 0 ) );
  startCrossGeometry.vertices.push( new THREE.Vector3( id/2, 0 , 0 ) );
  
  this.centerCross = new THREE.Line( startCrossGeometry, new GizmoLineMaterial( { color: this.color, opacity:opacity, transparent:true } ),THREE.LinePieces );
  this.centerCross.material.depthTest   = true;
  this.centerCross.material.depthWrite  = true;
  this.centerCross.material.renderDepth = 1e20;
  
  this.add( this.centerCross ) ;
  this.position.copy( position );
}

CrossHelper.prototype = Object.create( BaseHelper.prototype );
CrossHelper.prototype.constructor = CrossHelper;  
