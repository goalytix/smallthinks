// =========================================
// numfade - you can see the next color.
// Tap a box next to a box of the same color
// and they both fade away!
// =========================================

const COLUMNS = 10;
const ROWS = 12;
const TOTAL_BOXES = COLUMNS * ROWS; // 120
const SHOW_TIME = 600;              // how long (ms) a match shows before fading

// 6 colors that are easy to tell apart. Each has:
// - a text color that is easy to read on it (contrast of at least 4.5 : 1)
// - a shape, for kids who can't tell some colors apart
//   (︎ asks the device to draw it as a plain symbol, not an emoji)
const COLORS = [
  { name: "red",    background: "#d62828", text: "#ffffff", shape: "♥︎" }, // ♥
  { name: "orange", background: "#ff924c", text: "#1d2b4f", shape: "▲︎" }, // ▲
  { name: "yellow", background: "#ffca3a", text: "#1d2b4f", shape: "★︎" }, // ★
  { name: "green",  background: "#8ac926", text: "#1d2b4f", shape: "■︎" }, // ■
  { name: "blue",   background: "#1673b0", text: "#ffffff", shape: "●︎" }, // ●
  { name: "purple", background: "#6a4c93", text: "#ffffff", shape: "◆︎" }, // ◆
];

const board = document.getElementById("board");
const resetButton = document.getElementById("reset-button");
const nextSwatch = document.getElementById("next-color");
const fadedCountText = document.getElementById("faded-count");
const win = document.getElementById("win");
const winCountText = document.getElementById("win-count");
const playAgainButton = document.getElementById("play-again");

let boxes = [];          // all 120 boxes, in order
let nextColorIndex = -1; // the color the next tap will get
let fadedCount = 0;
let waiting = false;     // true while a match is showing, so taps wait

// Pick a random color for the next tap, not the same as the last one
function pickNextColor() {
  let index = Math.floor(Math.random() * COLORS.length);
  while (index === nextColorIndex) {
    index = Math.floor(Math.random() * COLORS.length);
  }
  nextColorIndex = index;

  // Show it in the "Next" square
  const color = COLORS[index];
  nextSwatch.style.backgroundColor = color.background;
  nextSwatch.style.color = color.text;
  nextSwatch.textContent = color.shape;
  nextSwatch.setAttribute("aria-label", "Next color: " + color.name);
  nextSwatch.classList.remove("pop");
  void nextSwatch.offsetWidth; // restart the bounce animation
  nextSwatch.classList.add("pop");
}

// The boxes right above, below, left and right of a box
function getNeighbors(position) {
  const row = Math.floor(position / COLUMNS);
  const column = position % COLUMNS;
  const neighbors = [];

  if (row > 0) neighbors.push(boxes[position - COLUMNS]);           // above
  if (row < ROWS - 1) neighbors.push(boxes[position + COLUMNS]);    // below
  if (column > 0) neighbors.push(boxes[position - 1]);              // left
  if (column < COLUMNS - 1) neighbors.push(boxes[position + 1]);    // right

  return neighbors;
}

function tapBox(box, position) {
  // Only white boxes can be tapped
  if (waiting || box.classList.contains("colored")) return;

  const colorIndex = nextColorIndex;
  const color = COLORS[colorIndex];
  box.style.backgroundColor = color.background;
  box.style.color = color.text;
  box.dataset.color = colorIndex;
  box.dataset.shape = color.shape;
  box.classList.add("colored", "pop");

  Sound.pop();
  Sound.say(box.textContent);
  pickNextColor();

  // Which neighbors have the same color?
  const matches = getNeighbors(position).filter(function (neighbor) {
    return neighbor.classList.contains("colored") && neighbor.dataset.color === String(colorIndex);
  });

  if (matches.length > 0) {
    // A match! Show it for a moment, then fade them all
    matches.push(box);
    waiting = true;
    setTimeout(function () {
      matches.forEach(fadeBox);
      fadedCount += matches.length;
      fadedCountText.textContent = fadedCount;
      Sound.whoosh();
      waiting = false;
      checkForWin();
    }, SHOW_TIME);
  } else {
    checkForWin();
  }
}

// Make a box look like an empty slot that can't be tapped
function fadeBox(box) {
  box.classList.remove("colored", "pop");
  box.classList.add("faded");
  box.style.backgroundColor = "";
  box.style.color = "";
  box.disabled = true;
  box.setAttribute("aria-label", "empty");
}

// The game ends when no white boxes are left
function checkForWin() {
  const whiteBoxes = board.querySelectorAll(".box:not(.colored):not(.faded)");
  if (whiteBoxes.length === 0) {
    winCountText.textContent = fadedCount;
    win.hidden = false;
    playAgainButton.focus();
    confetti();
    Sound.tada();
  }
}

// Make the 120 boxes (also used to start over)
function newGame() {
  board.innerHTML = "";
  boxes = [];
  for (let position = 0; position < TOTAL_BOXES; position++) {
    const box = document.createElement("button");
    box.className = "box";
    box.textContent = position + 1;
    box.addEventListener("click", function () {
      tapBox(box, position);
    });
    board.appendChild(box);
    boxes.push(box);
  }
  nextColorIndex = -1;
  pickNextColor();
  fadedCount = 0;
  fadedCountText.textContent = 0;
  waiting = false;
  win.hidden = true;
}

holdButton(resetButton, function () {
  newGame();
  Sound.pop();
});

playAgainButton.addEventListener("click", function () {
  newGame();
  Sound.pop();
});

newGame();
