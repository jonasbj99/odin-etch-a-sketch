// Default settings
const settingsObj = {
  color: "#000000",
  rainbowColor: "#ffffff",
  size: null,
  clickOn: true,
  activeTool: null,
};

// Grid container
const etchContainer = document.querySelector(".etch-container");

// Settings elements
const colorChanger = document.querySelector("#colorChanger");
colorChanger.addEventListener("change", (event) => {
  changeColor(event.target.value);
});
const toggleGridBtn = document.querySelector("#toggleGridBtn");
toggleGridBtn.addEventListener("click", toggleGrid);
const clearBtn = document.querySelector("#clearBtn");
clearBtn.addEventListener("click", clearGrid);
const gridSizeButtons = document.querySelectorAll(".gridSizeBtn");
gridSizeButtons.forEach((btn) =>
  btn.addEventListener("click", () => changeGrid(btn, btn.value)),
);

// Tool elements
const colorPickerBtn = document.querySelector("#colorPickerBtn");
colorPickerBtn.addEventListener("click", () =>
  changeTool(colorPickerBtn, pipettePixel),
);
const paintBtn = document.querySelector("#paintBtn");
const eraseBtn = document.querySelector("#eraseBtn");
const fillBtn = document.querySelector("#fillBtn");
const paintbowBtn = document.querySelector("#paintbowBtn");
const darkenBtn = document.querySelector("#darkenBtn");
const lightenBtn = document.querySelector("#lightenBtn");

const activeArr = [
  colorPickerBtn,
  paintBtn,
  eraseBtn,
  fillBtn,
  paintbowBtn,
  darkenBtn,
  lightenBtn,
];

// Tool event listeners
paintBtn.addEventListener("click", () => changeTool(paintBtn, paintPixel));
eraseBtn.addEventListener("click", () => changeTool(eraseBtn, erasePixel));
fillBtn.addEventListener("click", () => changeTool(fillBtn, fillPixels));
paintbowBtn.addEventListener("click", () =>
  changeTool(paintbowBtn, paintbowPixel),
);
darkenBtn.addEventListener("click", () => changeTool(darkenBtn, darkenPixel));
lightenBtn.addEventListener("click", () =>
  changeTool(lightenBtn, lightenPixel),
);

// Default grid and tool
changeGrid(gridSizeButtons[0], 16);
changeTool(paintBtn, paintPixel);

function paintPixel(el) {
  el.style.backgroundColor = settingsObj.color;
}

function erasePixel(el) {
  el.removeAttribute("style");
}

function darkenPixel(el) {
  const rgb = getComputedStyle(el).backgroundColor;
  const hsl = hexToHsl(convertToHex(rgb));
  let h = hsl[0];
  let s = hsl[1];
  // Subtract 10% lightness, limited to 0
  let l = hsl[2] - 10 <= 0 ? 0 : hsl[2] - 10;
  el.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
}

function lightenPixel(el) {
  const rgb = getComputedStyle(el).backgroundColor;
  const hsl = hexToHsl(convertToHex(rgb));
  let h = hsl[0];
  let s = hsl[1];
  // Add 10% lightness, limited to 100
  let l = hsl[2] + 10 >= 100 ? 100 : hsl[2] + 10;
  el.style.backgroundColor = `hsl(${h}, ${s}%, ${l}%)`;
}

// !!! Problem with large pixel areas due to call stack issues
// !!! Consider while looping horizontally saving same color pixels to array
// !!! Then loop vertically finding the rest of the connected pixels
function fillPixels(el) {
  const id = el.id.slice(1).split("-");
  const y = +id[0];
  const x = +id[1];
  const currentBg = convertToHex(getComputedStyle(el).backgroundColor);

  if (currentBg === settingsObj.color) {
    return;
  } else {
    el.style.backgroundColor = settingsObj.color;

    let adjacent = [];
    // Add adjacent pixels within grid bounds
    if (x < settingsObj.size) adjacent.push(`#p${y}-${x + 1}`);
    if (x > 1) adjacent.push(`#p${y}-${x - 1}`);
    if (y < settingsObj.size) adjacent.push(`#p${y + 1}-${x}`);
    if (y > 1) adjacent.push(`#p${+y - 1}-${x}`);

    // Call function on adjacent pixels with same background color
    adjacent.forEach((id) => {
      const adjEl = document.querySelector(id);
      const adjBg = convertToHex(getComputedStyle(adjEl).backgroundColor);
      if (currentBg === adjBg) fillPixels(adjEl);
    });
  }
}

function paintbowPixel(el) {
  const rNum = Math.floor(Math.random() * 255);
  const gNum = Math.floor(Math.random() * 255);
  const bNum = Math.floor(Math.random() * 255);
  settingsObj.rainbowColor = `rgb(${rNum}, ${gNum}, ${bNum})`;
  el.style.backgroundColor = settingsObj.rainbowColor;
}

function pipettePixel(el) {
  const color = getComputedStyle(el).backgroundColor;
  changeColor(color);
}

// ?!? Consider different solution for pipette
function useActiveTool(event) {
  const el = event.currentTarget;
  const tool = settingsObj.activeTool;
  if (!settingsObj.clickOn && tool != pipettePixel && tool != fillPixels) {
    settingsObj.activeTool(el);
  } else if (event.buttons === 1) {
    settingsObj.activeTool(el);
  }
}

function changeTool(el, func) {
  activeArr.forEach((btn) => btn.classList.remove("active"));
  el.classList.add("active");
  settingsObj.activeTool = func;
}

function changeGrid(btn, size) {
  if (size != settingsObj.size) {
    gridSizeButtons.forEach((btn) => btn.classList.remove("active"));
    btn.classList.add("active");
    const prevPixels = saveGrid();
    const prevSize = settingsObj.size;
    settingsObj.size = size;
    generateGrid(size);
    applyGrid(prevPixels, prevSize);
  }
}

// ?!? Consider saving pixels when changing size
function generateGrid(size) {
  settingsObj.size = size;

  // Clear existing grid
  const children = etchContainer.querySelectorAll("*");
  children.forEach((child) => child.remove());

  // Add new grid children based on size x size
  for (let i = 1; i <= size; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add("etch-row");

    for (let j = 1; j <= size; j++) {
      const newEl = document.createElement("div");
      newEl.setAttribute("id", `p${i}-${j}`);
      newEl.classList.add("etch-pixel");

      newEl.addEventListener("mouseenter", useActiveTool);
      newEl.addEventListener("mousedown", useActiveTool);

      newRow.appendChild(newEl);
    }

    etchContainer.appendChild(newRow);
  }
}

function saveGrid() {
  const allPixels = etchContainer.querySelectorAll(".etch-pixel");
  let savedPixels = [];

  allPixels.forEach((px) => {
    let coord = px.id.slice(1).split("-");
    if (px.style.backgroundColor != "") {
      savedPixels.push({
        row: coord[0],
        col: coord[1],
        bg: convertToHex(getComputedStyle(px).backgroundColor),
      });
    }
  });

  return savedPixels;
}

function applyGrid(prevGrid, prevSize) {
  const scale = settingsObj.size / prevSize;

  if (scale > 1) {
    prevGrid.forEach((px) => {
      for (let i = 1; i <= scale; i++) {
        let row = (px.row - 1) * scale + i;
        for (let j = 1; j <= scale; j++) {
          let col = (px.col - 1) * scale + j;
          let newID = arrayToId([row, col]);
          let newEl = etchContainer.querySelector(newID);
          newEl.style.backgroundColor = px.bg;
        }
      }
    });
  }
}

function arrayToId(arr) {
  return `#p${arr[0]}-${arr[1]}`;
}

function changeColor(color) {
  const converted = convertToHex(color);
  settingsObj.color = converted;
  colorChanger.value = converted;
}

function clearGrid() {
  const children = etchContainer.querySelectorAll(".etch-pixel");
  children.forEach((child) => child.removeAttribute("style"));
}

function toggleGrid() {
  etchContainer.style.gap = etchContainer.style.gap === "0px" ? "1px" : "0px";
}

function convertToHex(color) {
  // Temporary element to get computed style in hex format
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  // Computed to rgb/rgba to hex
  const rgb = computed.match(/\d+/g);

  const r = parseInt(rgb[0]).toString(16).padStart(2, "0");
  const g = parseInt(rgb[1]).toString(16).padStart(2, "0");
  const b = parseInt(rgb[2]).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}

function hexToHsl(hex) {
  // Hex to r, g, and b
  let r = parseInt(hex.substr(1, 2), 16);
  let g = parseInt(hex.substr(3, 2), 16);
  let b = parseInt(hex.substr(5, 2), 16);

  // Convert rgb ranges from 0-255 to 0-1
  const rgb = ((r /= 255), (g /= 255), (b /= 255));

  // Strongest and weakest color channel
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);

  // Define hue and saturation, calculate lightness
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    // Achromatic/gray
    h = s = 0;
  } else {
    const d = max - min;
    // Calculate saturation
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Calculate hue based on strongest rgb channel
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    // Convert range from 0-6 to 0-1
    h /= 6;
  }

  // Convert to CSS ranges and return
  return [h * 360, s * 100, l * 100];
}
