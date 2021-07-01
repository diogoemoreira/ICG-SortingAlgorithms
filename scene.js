"use strict";

/*
-> Simulate sorting algorithms in arrays of integers.
-> The integers are represented by parallelepiped sorted by their height
-> It must be possible to indicate if the elements are already sorted, 
in reverse order, or in random positions.
*/

// To store the scene graph, and elements usefull to rendering the scene
const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,
    renderer: null,
    loader: null,
};

let array = [],
    animationQueue = [],
    speed=0.2;

//Initialize the empty scene
helper.initEmptyScene(sceneElements);
//Add elements within the scene
load3DObjects(sceneElements.sceneGraph, sceneElements.loader);

//Animate
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow); //resize window
document.getElementById('bubbleSort').addEventListener('click', bubbleSort);
document.getElementById('selectionSort').addEventListener('click', selectionSort);

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph, loader) {
    // Create a ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshPhongMaterial({ map: loader.load('https://i.imgur.com/U6WeR3u.png'), side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    sceneGraph.add(planeObject);

    // Change orientation of the plane using rotation
    planeObject.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    // Set shadow property
    planeObject.receiveShadow = true;

    // Create 8 cubes and give them random positions
    var names = 0;

    for(var i=0; i<4;i+=0.5){
        const cubeGeometry = new THREE.BoxGeometry(1, 1+i, 1);
        const cubeMaterial = new THREE.MeshPhongMaterial({map:loader.load('https://img.freepik.com/free-photo/empty-poker-table-casino_131286-84.jpg?size=626&ext=jpg') });
        const cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // Set position of the cube
        //cubeObject.position.set(-6+i*3,(1+i)/2+0.01,0);

        // Set shadow property
        cubeObject.castShadow = true;
        cubeObject.receiveShadow = true;

        // Name
        cubeObject.name = "cube"+names;
        array.push(cubeObject);

        names++;
    }

    shuffle(sceneGraph);
    //add cubes to the scene
    for(var i=0;i<array.length;i++){
        console.log(array[i].name);

        array[i].position.set(-6+(i/2)*3,array[i].geometry.parameters.height/2+0.01,0);

        sceneGraph.add(array[i]);
    }
    //
}

function computeFrame(time) {    
    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}

function bubbleSort(){
    //iterate through the array and confirm if the next element
    //is lower than the current one swap them
    //do this until the array is fully sorted
    var iteration=1;
    var sorted = false;
    while(sorted!=true || iteration<array.length-1){
        sorted=true; //if no swaps are made then the array is sorted
        for(var i=0;i<array.length-iteration;i++){
            if(array[i].geometry.parameters.height>array[i+1].geometry.parameters.height){
                sorted=false;
                [array[i], array[i+1]] = [
                    array[i+1], array[i]]; //swap position
            }
        }
        iteration++;
    }
    for(var i=0;i<array.length;i++){
        console.log("Bubble "+array[i].name);
    }
}

function selectionSort(){
    //find the lowest element and swap it to the first position of the array
    var iteration=0;
    var sorted = false;
    while(sorted!=true || iteration<array.length-1){
        sorted=true; //if no swaps are made then the array is sorted
        var lowest=iteration; //index of the lowest number
        for(var i=iteration;i<array.length-1;i++){
            if(array[lowest].geometry.parameters.height>array[i+1].geometry.parameters.height){
                sorted=false;
                lowest=i+1;
            }
        }
        //swap the lowest/smallest element with the "first" element of the array
        [array[lowest], array[iteration]] = [
            array[iteration], array[lowest]];
        iteration++;
    }
    for(var i=0;i<array.length;i++){
        console.log("Selection "+array[i].name);
    }
}

function shuffle(sceneGraph) {
    //Fisher-Yates (aka Knuth) Shuffle
    //from https://github.com/coolaj86/knuth-shuffle
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }  
  }
