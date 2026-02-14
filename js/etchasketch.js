const etchContainer = document.querySelector('[class^="etch-container"]');

let mouseDown = false;
document.addEventListener("mousedown", () => (mouseDown = true));
document.addEventListener("mouseup", () => (mouseDown = false));

// Default settings
const settingsObj = {
	color: "#000",
	rainbowColor: "#fff",
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

			newRow.appendChild(newEl);
		}

		etchContainer.appendChild(newRow);
	}
}

// Change tool function instead of if/else statements
function colorPixel(el) {
	el.style.backgroundColor = settingsObj.color;
}

function erasePixel(el) {
	el.removeAttribute("style");
}

function rainbowPixel(el) {
	const rNum = Math.floor(Math.random() * 255);
	const gNum = Math.floor(Math.random() * 255);
	const bNum = Math.floor(Math.random() * 255);
	settingsObj.rainbowColor = `rgb(${rNum}, ${gNum}, ${bNum})`;
	el.style.backgroundColor = settingsObj.rainbowColor;
}

function clearGrid() {
	const children = etchContainer.querySelectorAll(".etch-pixel");
	children.forEach((child) => child.removeAttribute("style"));
}

// Does not work optimally, when mouseenter is followed by mousedown
function useActiveTool(event) {
	const el = event.currentTarget;
	if (!settingsObj.clickOn) {
		settingsObj.activeTool(el);
	} else if (event.buttons === 1) {
		settingsObj.activeTool(el);
	}
}

// Potentially remove
function changeTool(func = settingsObj.activeTool) {
	settingsObj.activeTool = func;
	const children = etchContainer.querySelectorAll(".etch-pixel");
	children.forEach((child) => {
		// Replace to clear event listeners
		child.replaceWith(child.cloneNode(true));
		child.addEventListener("mouseenter", func);
	});
}

// Pick color

// Opacity mode

// Grid on or off

// Fill tool

// Color pipette
