import * as THREE from 'three';
import Stats from 'stats.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const OBJECT_COUNT = 200;
const PLANE_SIZE = 50;
const START_DEPTH = -1;
const MAX_SPEED = 10;
const MIN_SPEED = 5;
const SPEED_RATIO = MIN_SPEED/MAX_SPEED;
const MAX_ROTATION_SPEED= .1;
const FOCUS_DIST = 1200;
const SCALE = 2;
const CLIPPING_DISTANCE = 800;

const NEW_PROB = 2;

function generate_vector() {
  let startx = Math.random()*2*PLANE_SIZE - PLANE_SIZE;
  let starty = Math.random()*2*PLANE_SIZE - PLANE_SIZE;
  let startz = -START_DEPTH;

  let disp = new THREE.Vector3(-startx, -starty, FOCUS_DIST-startz);
  disp.normalize();
  disp.multiplyScalar((1 - Math.random()*SPEED_RATIO)*MAX_SPEED);

  let rot = new THREE.Vector3(Math.random(), Math.random(), Math.random());
  rot.multiplyScalar(MAX_ROTATION_SPEED);

  return [new THREE.Vector3(startx, starty, startz), disp, rot];
}
function mousemoveHandler(e) {
	mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
}
function mouseupHandler() {
  this.down = false;
}
function mousedownHandler() {
  this.down = true;
}

let loader = new GLTFLoader();
loader.load('/shapes.glb', function (gltf) {

  let stats = new Stats();
  stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
  //document.body.appendChild( stats.dom );


  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth/2, window.innerHeight/2, false);
  renderer.setClearColor(0xFFA869, 1);
  document.getElementById("background").appendChild(renderer.domElement);
  window.addEventListener('resize', function() {
    this.setSize(window.innerWidth/2, window.innerHeight/2, false);
  }.bind(renderer))

  /*
  let raycaster = new THREE.Raycaster();
  let mouse = {
    pos: new THREE.Vector2(),
    down: false,
  };
  renderer.domElement.addEventListener('mousemove', mousemoveHandler.bind(mouse));
  renderer.domElement.addEventListener('mousedown', mousedownHandler.bind(mouse));
  renderer.domElement.addEventListener('mouseup', mouseupHandler.bind(mouse));
  */

  let camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, CLIPPING_DISTANCE);
  camera.lookAt(0,0,1);

  let scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(0x999999, 0, CLIPPING_DISTANCE);

  let objects = gltf.scene.children.map(e => e.geometry);
  
  let common_material = new THREE.MeshNormalMaterial();

  let meshes = [];
  
  let object_pointer = 0;
  let object_pool = [];
  let disp_pool = new Array(OBJECT_COUNT);
  let rot_pool  = new Array(OBJECT_COUNT);
  for (let i = 0; i < OBJECT_COUNT; i++) {
    object_pool.push(new THREE.Mesh(objects[Math.trunc(Math.random()*objects.length)], common_material));
    object_pool[i].position.z = -10;

    object_pool[i].scale.x = SCALE;
    object_pool[i].scale.y = SCALE;
    object_pool[i].scale.z = SCALE;
  }

  let furthest_object = 0;
  let furthest_dist = -1;

  let last_time = 0;
  let animate = function (time) {
    let delta = (time - last_time) / 1000;
    last_time = time;
    if (delta > 1) {
      delta = 0;
    }
    let d = delta;
    if (d * NEW_PROB > Math.random()) {
      let ind = object_pointer;
      if (scene.getObjectById(object_pool[object_pointer].id) !== undefined) {
        ind = furthest_object;
      }
      let [start, disp, rot] = generate_vector();
      disp_pool[ind] = disp;
      rot_pool[ind] = rot;
      object_pool[ind].position.x = start.x;
      object_pool[ind].position.y = start.y;
      object_pool[ind].position.z = start.z;
      scene.add(object_pool[ind]);
      object_pointer = (object_pointer + 1) % OBJECT_COUNT;
      
    }
    
    for (let i = 0; i < OBJECT_COUNT; i++) {
      if (scene.getObjectById(object_pool[i].id) === undefined) {
        continue;
      }
      if (object_pool[i].position.z > CLIPPING_DISTANCE) {
        scene.remove(object_pool[i]);
      } else {
        let dist = object_pool[i].position.distanceTo(new THREE.Vector3(0,0,0));
        if (furthest_dist < dist) {
          furthest_dist = dist;
          furthest_object = i;
        }
        object_pool[i].position.x += disp_pool[i].x * delta;
        object_pool[i].position.y += disp_pool[i].y * delta;
        object_pool[i].position.z += disp_pool[i].z * delta;

        object_pool[i].rotation.x += rot_pool[i].x * delta;
        object_pool[i].rotation.y += rot_pool[i].y * delta;
        object_pool[i].rotation.z += rot_pool[i].z * delta;
      }
    }

    /*
    raycaster.setFromCamera( mouse, camera );
    let intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {

    }
    */

    renderer.render(scene, camera);
    setTimeout(() => requestAnimationFrame(animate), 1000/30);
    stats.update();
  };

  animate();

}, undefined, function (error) {
  console.error(error);
});

