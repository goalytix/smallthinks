// =========================================================
// smallthinks - confetti for a happy finish
// confetti()  -> colorful pieces fall down the screen
// =========================================================

const CONFETTI_COLORS = ["#d62828", "#ff924c", "#ffca3a", "#8ac926", "#1673b0", "#6a4c93", "#ff8fab"];

function confetti() {
  // Skip it for people who prefer less movement
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = document.createElement("div");
  layer.className = "confetti";

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.animationDuration = 2 + Math.random() * 2 + "s"; // 2 to 4 seconds
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    layer.appendChild(piece);
  }

  document.body.appendChild(layer);

  // Clean up when all the pieces have fallen
  setTimeout(function () {
    layer.remove();
  }, 5000);
}
