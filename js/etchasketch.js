const etchContainer = document.querySelector('[class^="etch-container"]');

// Default settings
const settingsObj = {
	color: "#000",
	rainbowColor: "#fff",
	size: 16,
	clickOn: false,
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

function rainbowPixel(el) {
	const rNum = Math.floor(Math.random() * 255);
	const gNum = Math.floor(Math.random() * 255);
	const bNum = Math.floor(Math.random() * 255);
	settingsObj.rainbowColor = `rgb(${rNum}, ${gNum}, ${bNum})`;
	el.style.backgroundColor = settingsObj.rainbowColor;
}

function darkenPixel(el) {}

function lightenPixel(el) {}

function fillPixels(el) {}

function pipettePixel(el) {}

function clearGrid() {
	const children = etchContainer.querySelectorAll(".etch-pixel");
	children.forEach((child) => child.removeAttribute("style"));
}

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

function toggleGrid() {
	etchContainer.style.gap = etchContainer.style.gap === "0px" ? "1px" : "0px";
}
