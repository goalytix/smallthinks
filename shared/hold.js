// =========================================================
// smallthinks - buttons you have to press and hold
// Stops little fingers from wiping a game by accident.
//
// holdButton(button, whenDone)
//   whenDone runs after the button is held for HOLD_TIME.
//   A quick tap only shakes the button and says "Hold me!".
// =========================================================

const HOLD_TIME = 800; // milliseconds

function holdButton(button, whenDone) {
  const normalText = button.textContent;
  let timer = null;
  let tipTimer = null;

  button.classList.add("hold-button");
  button.style.setProperty("--hold-time", HOLD_TIME + "ms");

  function startHold(event) {
    if (event.button > 0) return; // only the main mouse button
    button.classList.add("holding");
    timer = setTimeout(function () {
      button.classList.remove("holding");
      timer = null;
      whenDone();
    }, HOLD_TIME);
  }

  function stopHold() {
    if (timer === null) return; // already done, or never started
    clearTimeout(timer);
    timer = null;
    button.classList.remove("holding");

    // Let go too soon: shake and show a tip for a moment
    button.classList.remove("shake");
    void button.offsetWidth; // restart the shake animation
    button.classList.add("shake");
    button.textContent = "✋ Hold me!";
    clearTimeout(tipTimer);
    tipTimer = setTimeout(function () {
      button.textContent = normalText;
    }, 1500);
  }

  button.addEventListener("pointerdown", startHold);
  button.addEventListener("pointerup", stopHold);
  button.addEventListener("pointerleave", stopHold);
  button.addEventListener("pointercancel", stopHold);
  button.addEventListener("contextmenu", function (event) {
    event.preventDefault(); // no menu on a long press
  });

  // Keyboard users (Enter or Space) don't need to hold
  button.addEventListener("click", function (event) {
    if (event.detail === 0) whenDone();
  });
}
