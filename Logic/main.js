"use strict";

//#region Canvas
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const canvasOffsets = canvas.getBoundingClientRect();
const offsetX = canvasOffsets.left;
const offsetY = canvasOffsets.top;

const canvas_width = canvas.width;
const canvas_height = canvas.height;

let shapes = [];

let current_index = null;
let is_dragging = false;

let startX;
let startY;

canvas.onmousedown = mouseDownHandler;
canvas.onmouseup = mouseUpHandler;
canvas.onmouseout = mouseOutHandler;
canvas.onmousemove = mouseMoveHandler;

function clickButtonHandler(){
    shapes = [];
    context.clearRect(0, 0, canvas_width, canvas_height);

    let aX = document.getElementById("Ax").value;
    let bX = document.getElementById("Bx").value;
    let cX = document.getElementById("Cx").value;
    let dX = document.getElementById("Dx").value;

    let aY = document.getElementById("Ay").value;
    let bY = document.getElementById("By").value;
    let cY = document.getElementById("Cy").value;
    let dY = document.getElementById("Dy").value;
    
    
    let A = { x: parseInt(aX), y: parseInt(aY), radius: 2.5, color: "black" };
    let B = { x: parseInt(bX), y: parseInt(bY), radius: 2.5, color: "black" };
    let C = { x: parseInt(cX), y: parseInt(cY), radius: 2.5, color: "black" };
    let D = { x: parseInt(dX), y: parseInt(dY), radius: 2.5, color: "black" };

    shapes.push({ x: A.x, y: A.y, radius: getRadius(A,B), color: "blue", center: A, circleBorder: B});
    shapes.push({ x: C.x, y: C.y, radius: getRadius(C,D), color: "yellow", center: C, circleBorder: D});

    shapes.push(A);
    shapes.push(B);
    shapes.push(C);
    shapes.push(D);

    drawShapes();
}
function getRadius(firstShape, secondShape){
    return Math.round(Math.sqrt((firstShape.x - secondShape.x) ** 2 + ((firstShape.y - secondShape.y) ** 2)));
}

function getIsMouseInShape(x, y, shape) {
    return shape.radius > Math.sqrt((x - shape.x) ** 2 + ((y - shape.y) ** 2));
}

function drawShapes() {
    context.clearRect(0, 0, canvas_width, canvas_height);
    for (let shape of shapes) {

            context.beginPath();
            context.arc(shape.x, shape.y, shape.radius, 2 * Math.PI, 0, false);
            context.fillStyle = shape.color;
            context.fill();
    }
}

function mouseDownHandler(event) {
    event.preventDefault();
    startX = event.clientX - offsetX;
    startY = event.clientY - offsetY;
    for (let i = 0; i < shapes.length; i++) {
        if (getIsMouseInShape(startX, startY, shapes[i])) {
            current_index = i;
            is_dragging = true;
            return;
        }
    }
}

function mouseUpHandler(event) {
    event.preventDefault();
    if (!is_dragging)
        return;
    is_dragging = false;
}

function mouseOutHandler(event) {
    event.preventDefault();
    if (!is_dragging)
        return;
    is_dragging = false;
}

function mouseMoveHandler(event) {
    event.preventDefault();
    if (!is_dragging){
        return;
    }

    let mouseX = event.clientX - offsetX;
    let mouseY = event.clientY - offsetY;
    
    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let current_shape = shapes[current_index];
    
    if(current_shape.center != null && current_shape.circleBorder != null){
        if(!isNaN(current_shape.radius)){
            current_shape.x += dx;
            current_shape.y += dy;
            current_shape.center.x += dx;
            current_shape.center.y += dy;
            current_shape.circleBorder.x += dx;
            current_shape.circleBorder.y += dy;
        }
    }
    else{
        for(let shape of shapes){
            if(current_shape == shape.circleBorder){
                current_shape = shape;
                break;
            }
        }
        if(current_shape.circleBorder != null){
            current_shape.circleBorder.x +=dx;
            current_shape.circleBorder.y +=dy;
            current_shape.radius = getRadius(current_shape.center, current_shape.circleBorder);
        }
    }
    drawShapes();
    startX = mouseX;
    startY = mouseY;
}
//#endregion

//#region Modal
var modal = document.getElementById("Modal");
var modalTitleElement = document.getElementById("modalTitle");
var modalContentElement = document.getElementById("modalContent");

function openModal() {
    modalTitleElement.innerHTML = "The coordinates of all points";
    modalContentElement.innerHTML = "";
    for(let shape of shapes){
        if(!(isNaN(shape.x) || isNaN(shape.y) || isNaN(shape.radius)))
        {
            var pointElement = document.createElement("p");
            pointElement.innerHTML = "Point " + ": (" + shape.x + ", " + shape.y + ") Radius: " + shape.radius + "Color: "+shape.color;
            modalContentElement.appendChild(pointElement);
        }
    }
    modal.style.display = "block";
  }
  
  function closeModal() {
    modal.style.display = "none";
  }
  //#endregion