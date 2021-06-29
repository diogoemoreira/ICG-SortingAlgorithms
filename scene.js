"use strict";

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
};

//Initialize the empty scene
helper.initEmptyScene(sceneElements);
//Add elements within the scene
load3DObjects(sceneElements.sceneGraph);

//Animate
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow); //resize window

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {
    // Create a ground plane
    const planeGeometry = new THREE.PlaneGeometry(6, 6);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    // Create a cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,0,0)' });
    const cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
    sceneGraph.add(cubeObject);

    // Set position of the cube
    // The base of the cube will be on the plane 
    cubeObject.translateY(0.5);

    // Set shadow property
    cubeObject.castShadow = true;
    cubeObject.receiveShadow = true;

    // Name
    cubeObject.name = "cube";
}

// Displacement value

var delta = 0.1;

var dispX = 0.2, dispZ = 0.2;

function computeFrame(time) {

    // THE SPOT LIGHT

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
