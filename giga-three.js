var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

var height = 4;
var geometry = new THREE.CylinderGeometry(1, 1, height, 6);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var cylinder = new THREE.Mesh( geometry, material );
cylinder.castShadow = true;
cylinder.receiveShadow = true;
cylinder.rotation.x = Math.PI / 3;
cylinder.rotation.y = 0;
cylinder.rotation.z = -Math.PI / 12;

var wireframe = new THREE.WireframeGeometry( geometry );

var line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 1;
line.material.transparent = true;
line.rotation.x = Math.PI / 3;
line.rotation.y = 0;
line.rotation.z = -Math.PI / 12;

scene.add( line );

var planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32, 32 );
var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.receiveShadow = true;
scene.add( plane );


camera.position.z = 5;

var light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set( 2, 2, 2 );
light.castShadow = true;
scene.add( light );

var direction = 1;
function animate() {
    requestAnimationFrame( animate );
    if (line.scale.y > 1.5) {
        direction = -1;
    } else if (line.scale.y < .5) {
        direction = 1;
    }
    line.scale.y += 0.01 * direction;
    renderer.render( scene, camera );
}
animate();
