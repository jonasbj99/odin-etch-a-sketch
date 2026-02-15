// Grid container
const etchContainer = document.querySelector('[class^="etch-container"]');

// Settings elements
const colorChanger = document.querySelector("#colorChanger");
colorChanger.addEventListener("change", (event) => {
	changeColor(event.target.value);
});

let mouseDown = false;
document.addEventListener("mousedown", () => (mouseDown = true));
document.addEventListener("mouseup", () => (mouseDown = false));

// Default settings
const settingsObj = {
	color: "#000000",
	rainbowColor: "#ffffff",
	size: 16,
	clickOn: true,
	activeTool: colorPixel,
};

generateGrid(settingsObj.size);

// ?!? Consider saving pixels when changing size
function generateGrid(size) {
	// Clear existing grid
	const children = etchContainer.querySelectorAll("*");
	children.forEach((child) => child.remove());

	// Remove any existing grid size class
	etchContainer.classList.forEach((className) => {
		if (className.startsWith("etch-container")) {
			etchContainer.classList.remove(className);
		}
	});

	etchContainer.classList.add(`etch-container-${size}`);

	// Add new grid children based on size x size
	for (let i = 1; i <= size; i++) {
		const newRow = document.createElement("div");
		newRow.classList.add("etch-row");

		for (let j = 1; j <= size; j++) {
			const newEl = document.createElement("div");
			newEl.setAttribute("id", `${i}-${j}`);
			newEl.classList.add("etch-pixel");

			newEl.addEventListener("mouseenter", useActiveTool);
			newEl.addEventListener("mousedown", useActiveTool);

			newRow.appendChild(newEl);
		}

		etchContainer.appendChild(newRow);
	}
}

function colorPixel(el) {
	el.style.backgroundColor = settingsObj.color;
}

function erasePixel(el) {
	el.removeAttribute("style");
}

function darkenPixel(el) {
	// Darken color of drawn pixel
}

function lightenPixel(el) {
	// Lighten color of drawn pixel
}

function fillPixels(el) {
	// Fill pixel and any adjacent pixels with same background color value
}

function rainbowPixel(el) {
	const rNum = Math.floor(Math.random() * 255);
	const gNum = Math.floor(Math.random() * 255);
	const bNum = Math.floor(Math.random() * 255);
	settingsObj.rainbowColor = `rgb(${rNum}, ${gNum}, ${bNum})`;
	el.style.backgroundColor = settingsObj.rainbowColor;
}

// ?!? Consider different solution for pipette
function useActiveTool(event) {
	const el = event.currentTarget;
	const tool = settingsObj.activeTool;
	if (!settingsObj.clickOn && tool != pipettePixel) {
		settingsObj.activeTool(el);
	} else if (event.buttons === 1) {
		settingsObj.activeTool(el);
	}
}

function pipettePixel(el) {
	const color = getComputedStyle(el).backgroundColor;
	changeColor(color);
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
