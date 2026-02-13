const etchContainer = document.querySelector('[class^="etch-container"]');

const settingsObj = {
  color: "#000",
  size: 16,
};

generateGrid(etchContainer, settingsObj.size);

function generateGrid(container, size) {
  // Clear existing grid
  const children = container.querySelectorAll("*");
  children.forEach((child) => child.remove());

  // Remove any existing grid size class
  container.classList.forEach((className) => {
    if (className.startsWith("etch-container")) {
      container.classList.remove(className);
    }
  });

  container.classList.add(`etch-container-${size}`);

  // Add new grid children based on size
  for (let i = 1; i <= size; i++) {
    const newRow = document.createElement("div");
    newRow.classList.add("etch-row");

    for (let j = 1; j <= size; j++) {
      const newEl = document.createElement("div");
      newEl.setAttribute("id", `${i}-${j}`);
      newEl.classList.add("etch-pixel");
      newEl.addEventListener("mouseenter", colorPixel);
      newRow.appendChild(newEl);
    }

    container.appendChild(newRow);
  }
}

function colorPixel(event) {
  const el = event.currentTarget;
  el.style.backgroundColor = settingsObj.color;
}
