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
    materials = {},
    speed=10,
    animating=false,
    clock= new THREE.Clock(),
    swapTime=0,
    anim;

//Initialize the empty scene
helper.initEmptyScene(sceneElements);
//Add elements within the scene
load3DObjects(sceneElements.sceneGraph, sceneElements.loader);

//Animate
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow); //resize window
document.getElementById('shuffle').addEventListener('click', shuffle);
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
    materials['texture'] = new THREE.MeshPhongMaterial({map:loader.load('https://img.freepik.com/free-photo/empty-poker-table-casino_131286-84.jpg?size=626&ext=jpg') });
    materials['color'] = new THREE.MeshPhongMaterial({ color: 0xff0000 });
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

        // Set shadow property
        cubeObject.castShadow = true;
        cubeObject.receiveShadow = true;

        // Name
        cubeObject.name = "cube"+names;
        array.push(cubeObject);

        names++;
    }

    shuffle();
    //add cubes to the scene
    for(var i=0;i<array.length;i++){
        console.log(array[i].name);

        array[i].position.set(-6+(i/2)*3,array[i].geometry.parameters.height/2+0.01,0);

        sceneGraph.add(array[i]);
    }
    //
}

function bubbleSort(){
    //iterate through the array and confirm if the next element
    //is lower than the current one swap them
    //do this until the array is fully sorted
    var iteration=1;
    var sorted = false;
    while(sorted!=true && iteration<array.length-1){
        sorted=true; //if no swaps are made then the array is sorted
        for(var i=0;i<array.length-iteration;i++){
            if(array[i].geometry.parameters.height>array[i+1].geometry.parameters.height){
                sorted=false;
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: true,
                    leftCube: array[i].name,
                    rightCube: array[i+1].name,
                    leftX: -6+(i/2)*3,
                    rightX: -6+((i+1)/2)*3,
                });
                [array[i], array[i+1]] = [
                    array[i+1], array[i]]; //swap position
            }
            else{
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: false,
                    leftCube: array[i].name,
                    rightCube: array[i+1].name,
                });
            }
        }
        iteration++;
    }
}

function selectionSort(){
    //find the lowest element and swap it to the first position of the array
    var iteration=0;
    while(iteration<array.length-1){
        var lowest=iteration; //index of the lowest number
        for(var i=iteration;i<array.length-1;i++){  
            if(array[lowest].geometry.parameters.height>array[i+1].geometry.parameters.height){
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: false,
                    leftCube: array[lowest].name,
                    rightCube: array[i+1].name,
                });
                lowest=i+1;
            }
            else{
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: false,
                    leftCube: array[lowest].name,
                    rightCube: array[i+1].name,
                });
            }
        }
        if(lowest!=iteration){
            //swap the lowest/smallest element with the "first" element of the array            
            animationQueue.push({
                //object with the cube that will move and their final position
                swapping: true,
                leftCube: array[iteration].name,
                rightCube: array[lowest].name,
                leftX: -6+(iteration/2)*3,
                rightX: -6+((lowest)/2)*3,
            });
            [array[lowest], array[iteration]] = [
                array[iteration], array[lowest]];
        }
        iteration++;
    }
}

function quickSort(){
    
}

function shuffle() {
    //Fisher-Yates (aka Knuth) Shuffle
    //from https://github.com/coolaj86/knuth-shuffle
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex].position.x, array[randomIndex].position.x] = [
        array[randomIndex].position.x, array[currentIndex].position.x];
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }  
}

function disableButtons(){
    document.getElementById('shuffle').disabled=true;
    document.getElementById('bubbleSort').disabled=true;
    document.getElementById('selectionSort').disabled=true;
}

function enableButtons(){
    document.getElementById('shuffle').disabled=false;
    document.getElementById('bubbleSort').disabled=false;
    document.getElementById('selectionSort').disabled=false;
}

function computeFrame(time) {    
    if(animating){
        var delta = clock.getDelta();
        //left cube
        var leftCube = sceneElements.sceneGraph.getObjectByName(anim.leftCube);
        var rightCube = sceneElements.sceneGraph.getObjectByName(anim.rightCube);
        leftCube.material=materials['color'];
        rightCube.material=materials['color'];

        if(anim.swapping){ //confirms if we are swapping cubes
            if(leftCube.position.z>-2 && leftCube.position.x == anim.leftX){
                leftCube.translateZ(-1*speed*delta);
                if(leftCube.position.z<-2){
                    //prevents overshoot
                    leftCube.position.z=-2;
                }
            }
            else if(leftCube.position.x<anim.rightX){
                leftCube.translateX(speed*delta);
                if(leftCube.position.x>anim.rightX){
                    //prevents overshoot
                    leftCube.position.x = anim.rightX;
                }
            }
            else{
                console.log("adadada");
                leftCube.translateZ(speed*delta);
                if(leftCube.position.z>0){
                    //prevents overshoot
                    leftCube.position.z=0;
                }
            }

            //right cube
            if(rightCube.position.z<2 && rightCube.position.x == anim.rightX){
                rightCube.translateZ(speed*delta);
                if(rightCube.position.z>2){
                    //prevents overshoot
                    rightCube.position.z=2;
                }
            }
            else if(rightCube.position.x>anim.leftX){
                rightCube.translateX(-1*speed*delta);
                if(rightCube.position.x<anim.leftX){
                    //prevents overshoot
                    rightCube.position.x = anim.leftX;
                }
            }
            else{
                rightCube.translateZ(-1*speed*delta);
                if(rightCube.position.z<0){
                    //prevents overshoot
                    rightCube.position.z=0;
                }
            }
            if( (leftCube.position.x == anim.rightX && leftCube.position.z == 0) && 
                    (rightCube.position.x == anim.leftX && rightCube.position.z == 0)){
                        leftCube.material=materials['texture'];
                        rightCube.material=materials['texture'];
                        animating=false;
                        enableButtons();
                    }
        }
        else{ //show which cubes we are comparing
            swapTime+=delta;
            if(swapTime>1){
                leftCube.material=materials['texture'];
                rightCube.material=materials['texture'];
                animating=false;
                swapTime=0;
                enableButtons();
            }
        }
    }
    else{
        if(animationQueue.length>0){
            anim = animationQueue.shift();
            disableButtons();
            animating=true;
        }
    }

    // Rendering
    helper.render(sceneElements);

    // NEW --- Update control of the camera
    sceneElements.control.update();

    // Call for the next frame
    requestAnimationFrame(computeFrame);
}
