"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dispatchMesh = dispatchMesh;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//hello Cura!
//assembly or scene ?? or what

var AssemblyScene = (function () {
	function AssemblyScene() {
		_classCallCheck(this, AssemblyScene);

		this._meshes = [];

		this._maxSize = [1000, 1000, 1000]; //max 1m square cube
	}

	_createClass(AssemblyScene, [{
		key: "arrangeAll",
		value: function arrangeAll() {
			var positionOnly = arguments.length <= 0 || arguments[0] === undefined ? False : arguments[0];

			oldList = this._meshes;
			this._meshes = [];
			for (obj in oldList) {
				obj.setPosition([0, 0]);
				//self.add(obj, positionOnly)
			}
		}
	}, {
		key: "centerAll",
		value: function centerAll() {}

		//TODO: needs to include children etc
		//TODO: implement
		/*_findFreePositionFor(obj){
  var posList = [];
  for a in this._meshes:
  	p = a.position.clone(); //
  	//if self._oneAtATime:
  	//	s = (a.getSize()[0:2] + obj.getSize()[0:2]) / 2 + self._sizeOffsets + self._headSizeOffsets + numpy.array([4,4], numpy.float32)
  	//else:
    s = (a.getSize()[0:2] + obj.getSize()[0:2]) / 2 + numpy.array([4,4], numpy.float32)
  	posList.push( p.add( s ).multiply( new THREE.Vector3( 1.0, 1.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3( 0.0, 1.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3( -1.0, 1.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3(  1.0, 0.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3( -1.0, 0.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3(  1.0,-1.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3(  0.0,-1.0, 0.0 ) ) );
  	posList.push(p.add( s ).multiply( new THREE.Vector3( -1.0,-1.0, 0.0 ) ) );
  	best = null;
  bestDist = null;
  for p in posList{
  	obj.setPosition(p)
  	ok = true;
  	for a in self._meshes{
  		if( this._checkHit( a, obj ) )
  		{
  			ok = false;
  			break;
  		}
  	}
  	if( ! ok ){
  		continue;
    }
  	dist = numpy.linalg.norm(p)
  	if( ! this.checkPlatform(obj) ){
  	  dist *= 3 ;
  	}
  	
  	if( best === null || dist < bestDist ){
  		best = p;
  		bestDist = dist;
  	}
   }
  if( best !== null){
  	obj.position.copy(best);
   }
  }*/

	}]);

	return AssemblyScene;
})();

/*horribly basic hack*/

function dispatchMesh(mesh, meshes) {

	for (var i = 0; i < meshes.length; i++) {
		var oMesh = meshes[i];
		//TODO : move current mesh until there is no overlap
	}
}