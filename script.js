'use strict'

$(document).ready(function(){

const container = document.querySelector("#container");
const clearBtn = document.querySelector("#clearGrid");
const rainbowBtn = document.querySelector("#rainbow");
const monoBtn = document.querySelector("#mono");
const inputSize = document.querySelector("#inputSize");
const inputBg = document.querySelector("#inputBg");
const inputCanvas = document.querySelector("#inputCanvas");
const inputMonoColor = document.querySelector("#inputMonoColor");
const body = document.querySelector("body");
let colorMode = "mono";

let hue = 342;
let hueStep = 0;
let hueLimit = 0;
let hueIncrement = 0;
let saturation = 94;
let satStep = 0;
let satLimit = 0;
let satIncrement = 0.0;
let value = 10;
let valStep = 0;
let valLimit = 0;
let valIncrement = 0.0;
let baseColor = "hsl(342, 94%, 10%)"
let monoColor = "hsl(81, 89%, 29%)"
let background = "hsl(210, 100%, 7%)"

rainbowBtn.addEventListener('click', () => {colorMode = "rainbow"});
monoBtn.addEventListener('click', () => {colorMode = "mono"});
clearBtn.addEventListener('click', () => {clearGrid(baseColor)});
inputSize.onkeyup = function(e) {
  let key = 'which' in e ? e.which : e.keyCode;
  if (key === 13) {changeGridSize()}
}

function changeBgColor() {
  body.style.background = inputBg.value;
}

function changeMonoColor() {
  body.style.color = inputMonoColor.value;
}

function changeCanvasColor() {

}

function changeGridSize() {
  let gridSize = Number(inputSize.value);
  if (isNaN(gridSize)) {generateGrid(16)}
  else {generateGrid(gridSize)}
}

function deleteGrid() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function generateGrid(size) {
  if (size < 1) {size = 1};
  if (size > 64) {size = 64};
  deleteGrid();
  container.style.gridTemplateRows = `repeat(${size}, 1fr`;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr`;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let item = document.createElement('div');
      item.classList.add('cell');
      item.id = `${row}x${col}`;
      container.appendChild(item);
      item.addEventListener('mouseenter', () => {changeColor(item)});
    }
  }
}

function colorizeMono(element) {
  element.addClass("colored");
}

function colorizeRainbow(element) {
  hueAdjust();
  satAdjust();
  valAdjust();
  element.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${value}%`
}

function hueAdjust() {
    // check if we need to set a new hue trajectory
    if (hueStep === 0) {
      hueLimit = Math.floor(Math.random() * 19) + 3;
      let target = Math.floor(Math.random() * 360);
      // check if we need to wrap around the hue circle
      if (Math.abs(target - hue) > 180) {
        if (target > hue) {
          target += -360;
        } else {
          target += 360;
        }
      }
      hueIncrement = (target - hue)/hueLimit;
    }
    hue += hueIncrement;
    if (hue < 0) {hue += 360}
    if (hue > 360) {hue += -360}
    hueStep += 1;
    if (hueStep >= hueLimit) {hueStep = 0; hueLimit = 0};
}

function satAdjust() {
  if (satStep === 0) {
    satLimit = Math.floor(Math.random() * 19) + 3;
    let target = Math.floor(Math.random() * 100);
    satIncrement = (target - saturation)/satLimit;
  }
  saturation += satIncrement;
  satStep += 1;
  if (satStep >= satLimit) {satStep = 0; satLimit = 0};
}

function valAdjust() {
  if (valStep === 0) {
    valLimit = Math.floor(Math.random() * 19) + 3;
    let target = Math.floor(Math.random() * 100);
    valIncrement = (target - value)/valLimit;
  }
  value += valIncrement;
  valStep += 1;
  if (valStep >= valLimit) {valStep = 0; valLimit = 0};
}


function changeColor(element) {
  if (colorMode === "mono") {
    colorizeMono(element);
  } else if (colorMode === "rainbow") {
    colorizeRainbow(element);
  }
}

function clearGrid(color) {
  let grid = container.querySelectorAll('.cell');
  grid.forEach(function(item) {
    item.style.backgroundColor = color;
  });
}

// starting value on pageload
generateGrid(16);

});
