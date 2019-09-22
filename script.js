"use strict";

function $(id) {
  return document.getElementById(id);
}

function ColorVector(value = 0, index = 0, limit = 0, increment = 0) {
  this.value = value; // current value of the color
  this.index = index; // nth step of vector
  this.limit = limit; // total number of steps until change to new vector
  this.increment = increment; // size of value of each step
}

$("hslRainbowBtn").addEventListener("click", () => {
  colorMode = "hsl";
});

$("rgbRainbowBtn").addEventListener("click", () => {
  colorMode = "rgb";
});

$("monoBtn").addEventListener("click", () => {
  colorMode = "mono";
});

$("rainbowBias").addEventListener("change", () => {
  rainbowBias = $("rainbowBias").checked; //returns boolean
});

$("clearBtn").addEventListener("click", () => {
  clearGrid(canvasColor);
});

$("gridSize").onkeyup = function(e) {
  let key = "which" in e ? e.which : e.keyCode;
  if (key === 13) {
    changeGridSize();
  }
};

function changeGridSize() {
  let gridSize = Number($("gridSize").value);
  if (isNaN(gridSize)) {
    generateGrid(16);
  } else {
    generateGrid(gridSize);
  }
}

function deleteGrid() {
  let container = $("container");
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
}

function generateGrid(size) {
  if (size < 1) {
    size = 1;
  }
  if (size > 64) {
    size = 64;
  }
  deleteGrid();
  container.style.gridTemplateRows = `repeat(${size}, 1fr`;
  container.style.gridTemplateColumns = `repeat(${size}, 1fr`;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let item = document.createElement("div");
      item.classList.add("cell");
      item.id = `${row}x${col}`;
      container.appendChild(item);
      item.addEventListener("mouseenter", () => {
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
function stepVector(vector, range) {
  // updates new vector if we've reached the limit
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

function stepWrappingVector(vector, range = 360) {
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
  vector.value = Math.abs((vector.value + vector.increment) % range);
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

function clearGrid(color) {
  let grid = container.querySelectorAll(".cell");
  grid.forEach(function(item) {
    item.style.backgroundColor = color;
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
