import * as THREE from 'three';

import { OrbitControls } from 'https://unpkg.com/three@0.149.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.149.0/examples/jsm/loaders/GLTFLoader.js';

import { EffectComposer } from 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'https://unpkg.com/three@0.149.0/examples/jsm/postprocessing/BloomPass.js';
//Importing junk
//Declaration Junk
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
//Loading Screen Code
const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById('progress-bar');



loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
}

const progressBarContainer = document.querySelector('.progress-bar-container');


loadingManager.onLoad = function() {
    progressBarContainer.style.display = 'none';
}
const gltfLoader = new GLTFLoader(loadingManager);
let mixer2;
let mixer3;
//lights
let jon = new THREE.AmbientLight(0x0000FF, 0.45);
scene.add(jon);



let muder = new THREE.PointLight(0xFFFFFF, 1);

muder.position.set(1000, 300, 305);

scene.add(muder);

let loderer = new THREE.PointLight(0xFFFFFF, 1);

loderer.position.set(880, 300, 400);

scene.add(loderer);
//Light on Pacman
const distance = 100.0;
const angle = Math.PI / 4.0;
const penumbra = 1;
const decay = 0.0;
const traindist = 10000.0;
const paclight = new THREE.SpotLight(0x0000FF, 0.7, distance, angle, penumbra, decay);
paclight.position.set(-400, 200.657, 100);
paclight.target.position.set(-280, 180.9898, 100);
scene.add(paclight);
scene.add(paclight.target);

const trainlight = new THREE.SpotLight(0x0000FF, 0.7, traindist, angle, penumbra, decay);
trainlight.position.set(-400, 200.657, 100);
trainlight.target.position.set(-280, 180.9898, 100);
scene.add(trainlight);
scene.add(trainlight.target);


//junk
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.shadowMap.enabled = true;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//Main area

gltfLoader.load('models/ArcadeGltf/Arcade.gltf' , (gltfScene) => {
    gltfScene.scene.position.set(0, 1, 0);
    gltfScene.scene.rotation.set(0, 0, 0);
    gltfScene.scene.scale.set(1, 1, 1);
    gltfScene.scene.transparent = false;
    scene.add( gltfScene.scene );
})

gltfLoader.load('models/lamp.glb' , (gltfScene) => {
    gltfScene.scene.position.set(1500, 105.001, 500);
    gltfScene.scene.rotation.set(0, 90, 0);
    gltfScene.scene.scale.set(100, 100, 100);
    gltfScene.scene.transparent = false;
    scene.add( gltfScene.scene );
})

gltfLoader.load('models/science_fiction_tramtrain_bridge/scene.gltf' , (gltfScene) => {
    gltfScene.scene.position.set(100, 1000.001, 100);
    gltfScene.scene.rotation.y = 180;
    gltfScene.scene.scale.set(60, 60, 60);
    gltfScene.scene.transparent = false;
    gltfScene.castShadow = true;
    gltfScene.receiveShadow = true;
    scene.add( gltfScene.scene );
})


//Background stuff
gltfLoader.load('models/armpit_city.glb' , (gabe) => {
    gabe.scene.position.set(-1150, 106.005, -1150);
    gabe.scene.rotation.set(0, 0, 0);
    gabe.scene.scale.set(160, 160, 160);
    gabe.scene.transparent = false;
    gabe.castShadow = true;
    gabe.receiveShadow = true;
    scene.add( gabe.scene );
})

gltfLoader.load('models/armpit_city.glb' , (gabe) => {
    gabe.scene.position.set(1150, 106.005, -1150);
    gabe.scene.rotation.set(0, -1, 0);
    gabe.scene.scale.set(160, 160, 160);
    gabe.scene.transparent = false;
    gabe.castShadow = true;
    gabe.receiveShadow = true;
    scene.add( gabe.scene );
})


const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new BloomPass(
  5.3, // strength
  25, // kernel size
  1, // sigma ?
  260 // blur render target resolution
);
composer.addPass(bloomPass);



let job;



//Animation junk
gltfLoader.load('models/Train/scene.gltf' , function (gltf)  {
    gltf.scene.position.set(100, 1285.001, 100);
    gltf.scene.rotation.set(0, 2.5, 0);
    gltf.scene.scale.set(100, 100, 100);
   
    job = gltf.scene;
    job.castShadow = true;
    job.receiveShadow = true;
    
    mixer2 = new THREE.AnimationMixer(job);
    mixer2.clipAction(gltf.animations[0]).play();
    const delta = clock.getDelta();
    mixer2.update( delta );
    
    
    scene.add( job );
})

gltfLoader.load('models/pacman_arcade__animation/scene.gltf' , function (gltf)  {
    gltf.scene.position.set(-280.8, 106.9898, 100);
    gltf.scene.rotation.set(0, 80.09, 0);
    gltf.scene.scale.set(3.9, 3.9, 3.9);
   
    const job = gltf.scene;
    job.castShadow = true;
    job.receiveShadow = true;
    mixer3 = new THREE.AnimationMixer(job);
    mixer3.clipAction(gltf.animations[0]).play();
    const delta = clock.getDelta();
    mixer3.update( delta );
    
    
    scene.add( job );
})
//floor
const Plane = new THREE.Mesh(
    new THREE.PlaneGeometry(4000, 4000, 100, 100),
    new THREE.MeshPhysicalMaterial({
        color: 0x0e0b0b,
        clearcoat: 5,
        clearcoatRoughness: 0,
        side: THREE.DoubleSide,
        transparent: false
      }));
Plane.castShadow = false;
Plane.receiveShadow = true;
Plane.rotation.x = -Math.PI / 2;
Plane.position.y = 105;
Plane.transparent = false;
scene.add(Plane);

const textureBG = new THREE.TextureLoader().load('img/enterFloormat.png');
const floorMat = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshPhysicalMaterial({map: textureBG, transparent: true, opacity: 0.5})
)
floorMat.castShadow = false;
floorMat.receiveShadow = true;
floorMat.rotation.x = -Math.PI / 2;
floorMat.position.y = 106;
floorMat.position.z = 600;
floorMat.scale.set(0.5, 0.5, 0.5)
floorMat.transparent = true;
scene.add(floorMat);
//Finishing up code
//Raycaster IMPORTANT
const uv = new THREE.TextureLoader().load('./img/My project-1.png');
const material456 = new THREE.MeshStandardMaterial({map: uv});
const mossh = new THREE.BoxGeometry(100, 100, 10);
const mush = new THREE.Mesh(mossh, material456);
mush.position.set(0, 280, 220);
scene.add(mush)
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Pointer over function
function isPointerOver() {
	raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(mush);
  
  // set cursor style
    document.body.style.cursor = intersects.length ?
    "pointer" :
    "default";

  // set the material color 
    if (intersects.length) {
        material456.color.set(0x00FF00);
    } else {
        material456.color.set(0xffffff);
    }
    
}

// Click function
function onPointerDown() {
	raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(mush);
  
  if(intersects.length)
  	window.open("/ArcadeHome/index.html");  
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Events listeners
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerdown', onPointerDown);









const controls = new OrbitControls( camera, renderer.domElement );
camera.position.z = 700;
camera.position.y = 500;
camera.position.x = 0;


function animate() {
	requestAnimationFrame( animate );
    isPointerOver();
    
    if(job.position.x < 1225 && job.position.z > -1409 ){
        job.position.x += 3;
        job.position.z -= 4;
        
    }

    if(job.position.x > 1224 && job.position.z < -1399) {
        job.visible = false;
        
    }

    if(job.visible === false) {
        job.position.x = -881;
        job.position.z = 1400;
    }

    if(job.position.x == -881 && job.position.z == 1400) {
        job.visible = true;
    }
    composer.render();
    console.log(job.position);
	renderer.render( scene, camera );
    const delta = (clock.getDelta() / 2);
    mixer2.update(delta * 3);
    mixer3.update(delta * 2)
    controls.update();
   

    
    
}
animate();



