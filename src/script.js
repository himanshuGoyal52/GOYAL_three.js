import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

// import typeFaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import typeFaceFontStatic from '../static/fonts/helvetiker_regular.typeface.json'

///////////// Attention , now use this //////////////////
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader'
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry'
import { Material } from 'three'

/////////////////// converting font into a type face 
// link : http://gero3.github.io/facetype.js/

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

///////////////////// Axes helper
const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/////////////////// Font loader
const fontLoader = new FontLoader();  // I think depricaited
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log("font loaded");
        const textGeometry = new TextGeometry(
            'GOYAL',
            {
                font : font,
                size : 0.5,
                height : 0.2,
                curveSegments : 5,
                bevelEnabled : true,
                bevelThickness : 0.03,
                bevelSize : 0.02,
                bevelOffset : 0,
                bevelSegments : 5,
            }
        );
        // Box Bounding
        // textGeometry.computeBoundingBox();
        // console.log(textGeometry.boundingBox);
        // textGeometry.translate(
        //    - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //    - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //    - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )
        // This was long but there is a much faster way

        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial();
        // textMaterial.wireframe = true;

        // using matcap materials ( ther is github for matcaps materials : use them)
        const textMatcapMaterial = new THREE.MeshMatcapMaterial({matcap:matcapTexture});

        const text = new THREE.Mesh(textGeometry , textMatcapMaterial);
        scene.add(text);

        // optimiztion ;) //
        const donutGeometry = new THREE.TorusBufferGeometry(0.3 , 0.2 , 20 , 45);
        const donutMaterial = new THREE.MeshMatcapMaterial({matcap:matcapTexture}); // more optimaztion is done by making only one matcap material
        for(let i = 0 ; i<100 ; i++){
            const donut = new THREE.Mesh(donutGeometry , donutMaterial);
            
            // adding randomness in their position
            donut.position.x = (Math.random()-0.5)*10;
            donut.position.y = (Math.random()-0.5)*10;
            donut.position.z = (Math.random()-0.5)*10;

            donut.rotation.x = Math.random() * Math.PI;
            donut.rotation.y = Math.random() * Math.PI;

            const scale = Math.random();
            donut.scale.x = scale;
            donut.scale.y = scale;
            donut.scale.z = scale;


            scene.add(donut);
        }

    }
);

/* Bounding : it helps three.js calculate if the object is on the screen (frustum culling) . We are going to use the bounding measures to recenter the geometry */
// By default , Three.js is using sphere bounding . Calculate the box bounding with computeBoundingBox() 

//////////// NOTE ///////////////////
/*
Creating a text geometry is long and hard for the computer Avoid doing it too many
times and keep the geometry as low poly as possible by reducing the curveSegments
and bevelSegments . Remove the wireframes one happy with the level of details
*/

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()