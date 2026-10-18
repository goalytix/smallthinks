// =========================================
// numchomp - the dog wants a number of donuts.
// Add donuts (adding) or take some back (taking away)
// until the plate has just the right number, then feed it!
// =========================================

const STARS_TO_WIN = 10;

// For each level: the biggest number, and the most donuts
// a kid has to add or take away in one round
const LEVELS = {
  5:  { biggest: 5,  mostChange: 4 },
  10: { biggest: 10, mostChange: 5 },
  20: { biggest: 20, mostChange: 10 },
};

const levelButtons = document.querySelectorAll(".level-button");
const starsBox = document.getElementById("stars");
const bubble = document.getElementById("bubble");
const dog = document.getElementById("dog");
const plate = document.getElementById("plate");
const addButton = document.getElementById("add-button");
const feedButton = document.getElementById("feed-button");
const message = document.getElementById("message");
const win = document.getElementById("win");
const playAgainButton = document.getElementById("play-again");

let level = LEVELS[5];
let wanted = 0;     // how many donuts the dog wants
let startWith = 0;  // how many donuts were on the plate at the start
let stars = 0;
let busy = false;   // true while the dog is eating or talking
let question = "";  // what the dog said, so it can be said again

// A random whole number from low to high (both included)
function randomBetween(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}

function donutsOnPlate() {
  return plate.querySelectorAll(".donut:not(.leaving)").length;
}

// ---------- Making a new round ----------

function newRound() {
  const biggest = level.biggest;
  const most = level.mostChange;

  if (Math.random() < 0.5) {
    // Adding round: fewer donuts than wanted
    wanted = randomBetween(2, biggest);
    startWith = randomBetween(Math.max(1, wanted - most), wanted - 1);
    bubble.innerHTML = "I want <strong>" + wanted + "</strong>!";
    question = "I want " + wanted + " donuts. I have " + startWith + ".";
  } else {
    // Taking-away round: more donuts than wanted
    startWith = randomBetween(2, biggest);
    wanted = randomBetween(Math.max(1, startWith - most), startWith - 1);
    bubble.innerHTML = "I only want <strong>" + wanted + "</strong>!";
    question = "I have " + startWith + " donuts. I only want " + wanted + "!";
  }

  Sound.say(question);
  restartAnimation(bubble, "pop");
  plate.innerHTML = "";
  for (let i = 0; i < startWith; i++) {
    addDonut(false);
  }
  message.textContent = "";
  dog.className = "dog";
  setBusy(false);
}

// ---------- Donuts ----------

// isAdded: true for donuts the kid adds (they sit on a yellow circle)
function addDonut(isAdded) {
  const donut = document.createElement("button");
  donut.className = isAdded ? "donut added" : "donut";
  donut.textContent = "🍩";
  donut.setAttribute("aria-label", "Donut. Tap to take it back.");
  donut.addEventListener("click", function () {
    takeBack(donut);
  });
  plate.appendChild(donut);
}

function takeBack(donut) {
  if (busy) return;
  donut.classList.add("leaving");
  Sound.whoosh();
  setTimeout(function () {
    donut.remove();
  }, 300);
}

addButton.addEventListener("click", function () {
  if (busy) return;
  // Leave room for a few too many, but not a whole mountain
  if (donutsOnPlate() >= level.biggest + 5) {
    showMessage("The plate is full!");
    return;
  }
  addDonut(true);
  Sound.pop();
});

// Tap the dog to hear the question again
document.querySelector(".dog-side").addEventListener("click", function () {
  if (busy) return;
  Sound.say(question);
  restartAnimation(dog, "hungry");
});

// ---------- Feeding ----------

feedButton.addEventListener("click", function () {
  if (busy) return;
  const count = donutsOnPlate();

  if (count === wanted) {
    eat();
  } else if (count > wanted) {
    restartAnimation(dog, "burp");
    Sound.burp();
    showMessage("Too many! Burp! 🤢");
    Sound.say("Too many! Take some back.");
  } else {
    restartAnimation(dog, "hungry");
    showMessage("More please! 😋");
    Sound.say("More please!");
  }
});

function eat() {
  setBusy(true);

  // Write the sum, like "5 + 3 = 8" or "9 − 3 = 6"
  const change = wanted - startWith;
  let sum;
  let spoken;
  if (change > 0) {
    sum = startWith + " + " + change + " = " + wanted;
    spoken = startWith + " plus " + change + " makes " + wanted + ". Yum!";
  } else {
    sum = startWith + " − " + -change + " = " + wanted;
    spoken = startWith + " take away " + -change + " leaves " + wanted + ". Yum!";
  }

  showMessage("Yum! " + sum);
  Sound.chomp();
  Sound.say(spoken);
  restartAnimation(dog, "munch");

  // The donuts disappear one after another
  const donuts = plate.querySelectorAll(".donut:not(.leaving)");
  donuts.forEach(function (donut, i) {
    donut.style.animationDelay = i * 0.06 + "s";
    donut.classList.add("eaten");
  });

  stars = stars + 1;
  drawStars();

  setTimeout(function () {
    if (stars >= STARS_TO_WIN) {
      win.hidden = false;
      playAgainButton.focus();
      confetti();
      Sound.tada();
    } else {
      newRound();
    }
  }, 3000);
}

// ---------- Little helpers ----------

function showMessage(text) {
  message.textContent = text;
  restartAnimation(message, "pop");
}

// Remove and add a class again so its animation plays from the start
function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth; // forces the browser to notice the class was removed
  element.classList.add(className);
}

function setBusy(isBusy) {
  busy = isBusy;
  addButton.disabled = isBusy;
  feedButton.disabled = isBusy;
}

function drawStars() {
  starsBox.innerHTML = "";
  for (let i = 0; i < STARS_TO_WIN; i++) {
    const star = document.createElement("span");
    star.className = i < stars ? "star earned" : "star";
    star.textContent = "⭐";
    // Only the newest star does the pop animation
    if (i !== stars - 1) star.style.animation = "none";
    starsBox.appendChild(star);
  }
  starsBox.setAttribute("aria-label", stars + " of " + STARS_TO_WIN + " stars");
}

// ---------- Starting and levels ----------

function newGame() {
  stars = 0;
  drawStars();
  win.hidden = true;
  newRound();
}

levelButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    level = LEVELS[button.dataset.max];
    levelButtons.forEach(function (other) {
      other.classList.toggle("chosen", other === button);
      other.setAttribute("aria-pressed", String(other === button));
    });
    Sound.pop();
    newGame();
  });
});

playAgainButton.addEventListener("click", function () {
  Sound.pop();
  newGame();
});

// Start on "Up to 5"
levelButtons[0].classList.add("chosen");
levelButtons[0].setAttribute("aria-pressed", "true");
levelButtons.forEach(function (button) {
  if (button !== levelButtons[0]) button.setAttribute("aria-pressed", "false");
});
newGame();
