"use strict";
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
    
    
    let radiusA = Math.round(Math.sqrt((aX - bX) ** 2 + ((aY - bY) ** 2)));
    let radiusC = Math.round(Math.sqrt((cX - dX) ** 2 + ((cY - dY) ** 2)));
    shapes.push({ x: parseInt(aX), y: parseInt(aY), radius: radiusA, color: "blue" });
    shapes.push({ x: parseInt(cX), y: parseInt(cY), radius: radiusC, color: "yellow" });
    drawShapes();
}


canvas.onmousedown = mouseDownHandler;
canvas.onmouseup = mouseUpHandler;
canvas.onmouseout = mouseOutHandler;
canvas.onmousemove = mouseMoveHandler;

function getIsMouseInShape(x, y, shape) {
    console.log(Math.sqrt((x - shape.x) ** 2 + ((y - shape.y) ** 2)));
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
    if (!is_dragging)
        return;
    let mouseX = event.clientX - offsetX;
    let mouseY = event.clientY - offsetY;
    let dx = mouseX - startX;
    let dy = mouseY - startY;
    let current_shape = shapes[current_index];
    current_shape.x += dx;
    current_shape.y += dy;
    drawShapes();
    startX = mouseX;
    startY = mouseY;
}