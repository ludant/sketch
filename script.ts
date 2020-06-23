"use strict";

function $(id: string) {
  return document.getElementById(id);
}

const canvas = $("canvas");
let gridSize = 16;

function ColorVector(value = 0, index = 0, limit = 0, increment = 0) {
  this.value = value; // current value of the color
  this.index = index; // nth step of vector
  this.limit = limit; // total number of steps until change to new vector
  this.increment = increment; // size of value of each step
}

$("HSLRainbowBtn").addEventListener("click", () => {
  colorMode = "hsl";
});
$("RGBRainbowBtn").addEventListener("click", () => {
  colorMode = "rgb";
});
$("monoBtn").addEventListener("click", () => {
  colorMode = "mono";
});
$("rainbowBias").addEventListener("change", () => {
  rainbowBias = $("rainbowBias").checked; // returns boolean
});
$("clearBtn").addEventListener("click", () => {
  clearGrid(canvasColor);
});
$("zigZagBtn").addEventListener("click", () => {
  colorZigZag();
});
// 13 is enter, so pushing enter causes generateGrid()
$("gridSize").onkeyup = function(e) {
  let key = "which" in e ? e.which : e.keyCode;
  if (key === 13) {
    gridSize = Number($("gridSize").value);
    if (isNaN(gridSize)) {
      generateGrid(16);
    } else {
      generateGrid(gridSize);
    }
  }
};

function deleteGrid() {
  while (canvas.firstChild) {
    canvas.removeChild(canvas.lastChild);
  }
}

function generateGrid(size: number) {
  if (size < 1) {
    size = 1;
  }
  if (size > 64) {
    size = 64;
  }
  deleteGrid();
  canvas.style.gridTemplateRows = `repeat(${size}, 1fr`;
  canvas.style.gridTemplateColumns = `repeat(${size}, 1fr`;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let item = document.createElement("div");
      item.classList.add("cell");
      item.classList.add(`row${row}`);
      item.id = `${row}x${col}`;
      canvas.appendChild(item);
      item.addEventListener("mouseenter", () => {
        changeColor(item);
      });
      item.addEventListener("touchstart", () => {
        changeColor(item);
      });
    }
  }
}

function colorizeMono(element) {
  element.removeAttribute("style");
  element.classList.add("colored");
}

function colorizeHSL(element) {
  stepVector(satVector, 100);
  stepVector(lightVector, 100);
  stepWrappingVector(hueVector, 360);
  element.style.backgroundColor = `hsl(${hueVector.value}, ${satVector.value}%, ${lightVector.value}%)`;
}

function colorizeRGB(element) {
  stepVector(redVector, 255);
  stepVector(greenVector, 255);
  stepVector(blueVector, 255);
  element.style.backgroundColor = `rgb(${redVector.value}, ${greenVector.value}, ${blueVector.value})`;
}

// increments a color value by one step
function stepVector(vector, range: number) {
  // define new vector if we're on the last step
  if (vector.index >= vector.limit) {
    vector.index = 0;
    vector.limit = Math.floor(Math.random() * 19) + 3;
    // optional value unbiasing
    let target;
    if (rainbowBias) {
      // flip a coin, make the target greater or less than current value
      if (Math.floor(Math.random() * 2)) {
        target = Math.floor(Math.random() * vector.value);
      } else {
        target =
          Math.floor(Math.random() * (range - vector.value)) + vector.value;
      }
    } else {
      target = Math.floor(Math.random() * range);
    }
    vector.increment = (target - vector.value) / vector.limit;
  }
  vector.value += vector.increment;
  vector.index++;
}

// in the hue circle, we need to define behavior that goes from hue 359 to 0
function stepWrappingVector(vector, range = 360) {
  // define new vector if we are on the last step
  if (vector.index >= vector.limit) {
    vector.index = 0;
    vector.limit = Math.floor(Math.random() * 19) + 3;
    let target = Math.floor(Math.random() * range);
    // check if we need to wrap around
    if (Math.abs(target - vector.value) > range / 2) {
      if (target > vector.value) {
        target += -range;
      } else {
        target += range;
      }
    }
    vector.increment = (target - vector.value) / vector.limit;
  }
  // this ensures descending values don't go negative (undefined)
  if (vector.value + vector.increment < 0) {
    vector.value += range;
  }
  vector.value = (vector.value + vector.increment) % range;
  vector.index++;
}

function changeColor(element) {
  switch (colorMode) {
    case "mono":
      colorizeMono(element);
      break;
    case "hsl":
      colorizeHSL(element);
      break;
    case "rgb":
      colorizeRGB(element);
      break;
  }
}

function colorZigZag() {
  let row = Array.from(canvas.querySelectorAll(`.row${i}`));
  if (i % 2 === 1) {
    row.reverse();
  }
  row.forEach(function(cell) {
    changeColor(cell);
  });
}

function clearGrid(color) {
  let grid = canvas.querySelectorAll(".cell");
  grid.forEach(function(item) {
    item.style = null;
    item.className = "cell";
  });
}

// init
generateGrid(16);

let colorMode = "mono";
let rainbowBias = false;

let hueVector = new ColorVector(342);
let satVector = new ColorVector(94);
let lightVector = new ColorVector(10);

let redVector = new ColorVector(49);
let blueVector = new ColorVector(2);
let greenVector = new ColorVector(16);

let canvasColor = "hsl(342, 94%, 10%)";
let monoColor = "hsl(81, 89%, 29%)";
let background = "hsl(210, 100%, 7%)";
