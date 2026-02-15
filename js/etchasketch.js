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
	console.log(hexToHsl(converted));
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
