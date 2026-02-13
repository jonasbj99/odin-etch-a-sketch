const etchContainer = document.querySelector('[class^="etch-container"]');

const settingsObj = {
  color: "#000",
  size: 16,
  clickOn: false,
  rainbowOn: true,
};

generateGrid(settingsObj.size);

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

  // Add new grid children based on size
  for (let i = 1; i <= size; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add("etch-row");

    for (let j = 1; j <= size; j++) {
      const newEl = document.createElement("div");
      newEl.setAttribute("id", `${i}-${j}`);
      newEl.classList.add("etch-pixel");

      if (settingsObj.clickOn) {
        newEl.addEventListener("click", colorPixel);
      } else {
        newEl.addEventListener("mouseenter", colorPixel);
      }
      newRow.appendChild(newEl);
    }

    etchContainer.appendChild(newRow);
  }
}

function colorPixel(event) {
  if (settingsObj.rainbowOn) {
    const rNum = Math.floor(Math.random() * 255);
    const gNum = Math.floor(Math.random() * 255);
    const bNum = Math.floor(Math.random() * 255);
    settingsObj.color = `rgb(${rNum}, ${gNum}, ${bNum})`;
  }
  const el = event.currentTarget;
  el.style.backgroundColor = settingsObj.color;
}

function clearGrid() {
  const children = etchContainer.querySelectorAll("*");
  children.forEach((child) => child.removeAttribute("style"));
}

// Pick color

// Erase

// Opacity mode
