// =========================================================
// smallthinks - the top bar shown on every page
//
// To add a new game, add one line to the GAMES list below.
// =========================================================

const GAMES = [
  { id: "numtap", name: "numtap", emoji: "🔢", about: "Tap the numbers, make colors!" },
  { id: "numfade", name: "numfade", emoji: "💨", about: "Put same colors side by side. Whoosh!" },
  { id: "numchomp", name: "numchomp", emoji: "🐶", about: "Feed the dog just the right number of donuts!" },
];

// Find the site's main folder from where this file lives (shared/nav.js).
// This keeps links working on GitHub Pages and when opening files directly.
const SITE_ROOT = new URL("../", document.currentScript.src);

function buildTopBar() {
  const currentGame = document.body.dataset.game; // e.g. "numtap", empty on home

  const bar = document.createElement("header");
  bar.className = "topbar";

  // Logo -> home page
  const logo = document.createElement("a");
  logo.className = "logo";
  logo.href = new URL("index.html", SITE_ROOT);
  logo.innerHTML = "small<span>thinks</span>";
  bar.appendChild(logo);

  // One tab for each game
  const tabs = document.createElement("nav");
  tabs.className = "tabs";
  tabs.setAttribute("aria-label", "Games");
  GAMES.forEach(function (game) {
    const tab = document.createElement("a");
    tab.className = "tab";
    tab.href = new URL("games/" + game.id + "/index.html", SITE_ROOT);
    tab.innerHTML = game.emoji + ' <span class="tab-name">' + game.name + "</span>";
    tab.setAttribute("aria-label", game.name);
    if (game.id === currentGame) {
      tab.classList.add("active");
      tab.setAttribute("aria-current", "page");
    }
    tabs.appendChild(tab);
  });
  bar.appendChild(tabs);

  // Sound on/off button
  const soundButton = document.createElement("button");
  soundButton.className = "big-button sound-button";
  function showSoundState() {
    soundButton.textContent = Sound.on ? "🔊" : "🔇";
    soundButton.setAttribute("aria-label", Sound.on ? "Turn sound off" : "Turn sound on");
    soundButton.setAttribute("aria-pressed", String(!Sound.on));
  }
  soundButton.addEventListener("click", function () {
    Sound.toggle();
    showSoundState();
  });
  showSoundState();
  bar.appendChild(soundButton);

  document.body.prepend(bar);
}

// On the home page, show a card for each game
function buildGameCards() {
  const list = document.getElementById("game-list");
  if (!list) return;

  GAMES.forEach(function (game) {
    const card = document.createElement("a");
    card.className = "game-card";
    card.href = new URL("games/" + game.id + "/index.html", SITE_ROOT);
    card.innerHTML =
      '<div class="emoji">' + game.emoji + "</div>" +
      "<h2>" + game.name + "</h2>" +
      "<p>" + game.about + "</p>";
    list.appendChild(card);
  });
}

buildTopBar();
buildGameCards();
