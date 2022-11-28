import './style.css'
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';
import * as THREE from 'three';

let camera, scene, renderer;
let mesh;

const loader = new THREE.TextureLoader();
const texture = loader.load("/minit.png");
const textureDepth = loader.load("/minitdepth.png");
const textureAlpha = loader.load("/minitalpha.png");
let plane, torus;
let minit = new THREE.Group();

init();
animate();

function createText(){
  const loaderFont = new FontLoader();
  var textMesh1;
  loaderFont.load('./optimer_regular.typeface.json', function (font) {
      const geometry = new TextGeometry('MINIT', {
          font: font,
          size: 20,
          height: 1,
          curveSegments: 10,
          bevelEnabled: false,
          bevelOffset: 0,
          bevelSegments: 1,
          bevelSize: 0.3,
          bevelThickness: 1
      });
      const materials = [
        new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
      ];
      textMesh1 = new THREE.Mesh(geometry, materials);
      textMesh1.castShadow = true

      textMesh1.geometry.computeBoundingBox();
      textMesh1.position.x -= textMesh1.geometry.boundingBox.max.x / 2;
      textMesh1.position.y -= textMesh1.geometry.boundingBox.max.y / 2;
      textMesh1.position.y -= 20
      // textMesh1.rotation.y = 0.25
      scene.add(textMesh1);
  });

}

function createHalo(){
  const geometry = new THREE.TorusGeometry(15, 1, 10, 20);
  const material = new THREE.MeshBasicMaterial( {
    color: 0xffff00
  });
  torus = new THREE.Mesh( geometry, material );
  torus.position.y = 20
  torus.position.x = -5
  torus.rotation.y = -0.5;
  torus.rotation.x = Math.PI / 2;

  minit.add( torus );
}

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 50;

  scene = new THREE.Scene();


  const pointLight = new THREE.PointLight({
    color: 0xffffff,
    intensity: 1,
  });
  pointLight.position.set(50, 0, 50);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight({
    color: 0xffffff,
    intensity: 1,
  });
  pointLight2.position.set(-50, 0, 50);
  scene.add(pointLight2);

  const geometry = new THREE.PlaneGeometry( 60, 60, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    displacementMap: textureDepth,
    displacementScale: 5,
    alphaMap: textureAlpha,
    transparent: true,
  })
  // material.displacementScale = 10;
  plane = new THREE.Mesh( geometry, material );
  plane.position.y = 5
  // plane.rotation.x = -Math.PI / 2;
  minit.add(plane);
  scene.add(minit);

  createText();
  createHalo();

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

  requestAnimationFrame( animate );

  // mesh.rotation.x += 0.005;
  // mesh.rotation.y += 0.01;

  minit.rotation.x = Math.sin(Date.now() / 1000) / 3;
  minit.rotation.y = Math.sin(Date.now() / 1500) / 3;
  // torus.position.y = 20 + Math.sin(Date.now() / 400) * 1;
  // torus.position.x = -5 + Math.sin(Date.now() / 400) * 1;
  
  renderer.render( scene, camera );

}