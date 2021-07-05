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
    skyBox: null,
};

let array = [],
    animationQueue = [],
    materials = {},
    speed=10,
    animating=false,
    clock= new THREE.Clock(),
    swapTime=0,
    anim,
    startingPoint=-5.25;

//Initialize the empty scene
helper.initEmptyScene(sceneElements);
//Add elements within the scene
load3DObjects(sceneElements.sceneGraph, sceneElements.loader);

//Animate
requestAnimationFrame(computeFrame);

// HANDLING EVENTS

// Event Listeners

window.addEventListener('resize', resizeWindow); //resize window
document.getElementById('reverse').addEventListener('click', reverseSort);
document.getElementById('shuffle').addEventListener('click', shuffle);
document.getElementById('bubbleSort').addEventListener('click', bubbleSort);
document.getElementById('selectionSort').addEventListener('click', selectionSort);
document.getElementById('quickSort').addEventListener('click', quickSort);
document.getElementById('insertionSort').addEventListener('click', insertionSort);
document.getElementById('stopAnim').addEventListener('click', stopAnim);

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
    const planeGeometry = new THREE.PlaneGeometry(15, 15);
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
    //add cubes to the scene
    for(var i=0;i<array.length;i++){
        array[i].position.set(startingPoint+(i/2)*3,array[i].geometry.parameters.height/2+0.01,0);

        sceneGraph.add(array[i]);
    }
    //
}

//Bubble sort
function bubbleSort(){
    //iterate through the array and confirm if the next element
    //is lower than the current one swap them
    //do this until the array is fully sorted
    var iteration=1;
    var sorted = false;
    while(sorted!=true && iteration<array.length){
        sorted=true; //if no swaps are made then the array is sorted
        for(var i=0;i<array.length-iteration;i++){
            if(array[i].geometry.parameters.height>array[i+1].geometry.parameters.height){
                sorted=false;
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: true,
                    leftCube: array[i].name,
                    rightCube: array[i+1].name,
                    leftX: startingPoint+(i/2)*3,
                    rightX: startingPoint+((i+1)/2)*3,
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
//end of Bubble sort

//Selection sort
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
                leftX: startingPoint+(iteration/2)*3,
                rightX: startingPoint+((lowest)/2)*3,
            });
            [array[lowest], array[iteration]] = [
                array[iteration], array[lowest]];
        }
        iteration++;
    }
}
//end of Selection sort

//Quick sort
function quickSort(){
    doQuickSort();
}
function doQuickSort(arr=array, left=0, right=array.length-1){
    var p;
    if(left<right){
        p = partition(arr,left,right);

        // Sort elements before partition
        // and after partition
        doQuickSort(arr, left, p-1);
        doQuickSort(arr, p+1, right);
    }
}

function partition(arr, left, right){
    var pivot_index = left;
    var pivot = arr[pivot_index];

    while (left<right){
        //increment left pointer until we find an element bigger than pivot
        while(left<arr.length && 
                arr[left].geometry.parameters.height <= pivot.geometry.parameters.height){
                    left++;
        }

        //decrement the right pointer until it finds an element smaller than pivot
        while(right>pivot_index && arr[right].geometry.parameters.height >= pivot.geometry.parameters.height){
            right--;
        }

        //if left and right pointers have not crossed each other, swap the elements
        if(left<right){
            animationQueue.push({
                //object with the cube that will move and their final position
                swapping: true,
                leftCube: arr[left].name,
                rightCube: arr[right].name,
                leftX: startingPoint+(left/2)*3,
                rightX: startingPoint+(right/2)*3,
            });
            [arr[left], arr[right]] = [
                arr[right], arr[left]];
        }
        else if(left<arr.length){
            animationQueue.push({
                //object with the cube that will move and their final position
                swapping: false,
                leftCube: arr[left].name,
                rightCube: arr[right].name,
            });
        }
    }

    //swap pivot element with element on the right pointer
    //this puts pivot in its right position
    animationQueue.push({
        //object with the cube that will move and their final position
        swapping: true,
        leftCube: arr[pivot_index].name,
        rightCube: arr[right].name,
        leftX: startingPoint+(pivot_index/2)*3,
        rightX: startingPoint+(right/2)*3,
    });
    [arr[pivot_index], arr[right]] = [
        arr[right], arr[pivot_index]];
    
    //return right pointer to divide the arry into 2 parts
    return right;
}
//end of Quick sort

//Insertion sort
function insertionSort(){
    var key,j;
   
    for(var i=1; i<array.length;i++){
        key=array[i];

        // Move elements of arr[0..i-1], that are greater than key, to one position ahead of their current position
        j=i-1;
        while(j>-1){
            if(key.geometry.parameters.height< array[j].geometry.parameters.height){
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: true,
                    leftCube: array[j].name,
                    rightCube: array[j+1].name,
                    leftX: startingPoint+(j/2)*3,
                    rightX: startingPoint+((j+1)/2)*3,
                });
                [array[j+1], array[j]] = [
                    array[j], array[j+1]]; 
                j--;
            }
            else{
                animationQueue.push({
                    //object with the cube that will move and their final position
                    swapping: false,
                    leftCube: array[j].name,
                    rightCube: key.name,
                });
                break;
            }
        }
        if(array[j+1]!=key){
            animationQueue.push({
                //object with the cube that will move and their final position
                swapping: true,
                leftCube: array[j+1].name,
                rightCube: key.name,
                leftX: startingPoint+((j+1)/2)*3,
                rightX: startingPoint+(i/2)*3,
            });
            array[j+1] = key;
        }
    }
}
//end of Insertion sort

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
    for(var i=0;i<array.length;i++){
        array[i].position.z=0;
        array[i].material=materials["texture"];
    }
}

function reverseSort(){
    var temp=[];
    for(var i=array.length-1;i>=0;i--){
        temp.push(sceneElements.sceneGraph.getObjectByName("cube"+i));
    }
    array=temp;
    for(var i=0;i<array.length;i++){
        array[i].position.set(-5.25+(i/2)*3,array[i].geometry.parameters.height/2+0.01,0);
    }
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
            if(swapTime>0.5){
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

function disableButtons(){
    document.getElementById('shuffle').disabled=true;
    document.getElementById('bubbleSort').disabled=true;
    document.getElementById('selectionSort').disabled=true;
    document.getElementById('quickSort').disabled=true;
    document.getElementById('insertionSort').disabled=true;
    document.getElementById('reverse').disabled=true;
}

function enableButtons(){
    document.getElementById('shuffle').disabled=false;
    document.getElementById('bubbleSort').disabled=false;
    document.getElementById('selectionSort').disabled=false;
    document.getElementById('quickSort').disabled=false;
    document.getElementById('insertionSort').disabled=false;
    document.getElementById('reverse').disabled=false;
}

function stopAnim(){
    animationQueue=[];
    animating=false;
    clock = new THREE.Clock();
    //add cubes to the scene
    for(var i=0;i<array.length;i++){
        array[i].position.set(startingPoint+(i/2)*3,array[i].geometry.parameters.height/2+0.01,0);
    }
    enableButtons();
    shuffle();
}