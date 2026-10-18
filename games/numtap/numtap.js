// =========================================
// numtap - tap a number, it gets a color!
// =========================================

const TOTAL_BOXES = 120; // 12 rows x 10 columns

// Bright colors to pick from, each with a text color that is easy to read on it
// (every pair has a contrast of at least 4.5 : 1)
const COLORS = [
  { background: "#d62828", text: "#ffffff" }, // red
  { background: "#ff924c", text: "#3d2f27" }, // orange
  { background: "#ffca3a", text: "#3d2f27" }, // yellow
  { background: "#c5ca30", text: "#3d2f27" }, // lime
  { background: "#8ac926", text: "#3d2f27" }, // green
  { background: "#36b37e", text: "#3d2f27" }, // teal
  { background: "#2e7d4f", text: "#ffffff" }, // leaf
  { background: "#1673b0", text: "#ffffff" }, // blue
  { background: "#4cc9f0", text: "#3d2f27" }, // sky
  { background: "#6a4c93", text: "#ffffff" }, // purple
  { background: "#b5179e", text: "#ffffff" }, // magenta
  { background: "#ff8fab", text: "#3d2f27" }, // pink
];

const board = document.getElementById("board");
const resetButton = document.getElementById("reset-button");

let lastColorIndex = -1; // no color picked yet

// Pick a random color that is not the same as the last one
function pickColor() {
  let index = Math.floor(Math.random() * COLORS.length);
  while (index === lastColorIndex) {
    index = Math.floor(Math.random() * COLORS.length);
  }
  lastColorIndex = index;
  return COLORS[index];
}

function colorBox(box) {
  const color = pickColor();
  box.style.backgroundColor = color.background;
  box.style.color = color.text;

  // Restart the bounce animation
  box.classList.remove("pop");
  void box.offsetWidth; // forces the browser to notice the class was removed
  box.classList.add("pop");

  Sound.pop();
  Sound.say(box.textContent);
}

// Make the 120 boxes
for (let number = 1; number <= TOTAL_BOXES; number++) {
  const box = document.createElement("button");
  box.className = "box";
  box.textContent = number;
  box.addEventListener("click", function () {
    colorBox(box);
  });
  board.appendChild(box);
}

// Reset turns every box white again
holdButton(resetButton, function () {
  const boxes = board.querySelectorAll(".box");
  boxes.forEach(function (box) {
    box.style.backgroundColor = "";
    box.style.color = "";
    box.classList.remove("pop");
  });
  lastColorIndex = -1;
  Sound.pop();
});
