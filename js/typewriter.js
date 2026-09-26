// typewriter.js — reusable typewriter effect.
//
// typewrite(el, text, speedMs) types `text` into `el` one character at a
// time and resolves once finished. A blinking block-cursor span is appended
// after the text and left in place (it keeps blinking forever via CSS).
//
// Respects prefers-reduced-motion: if the user has that preference set, the
// full text is shown instantly (no animation), matching the Definition of
// Done requirement.

/**
 * @param {HTMLElement} target - element to type into (its content is cleared first)
 * @param {string} text - text to type
 * @param {number} [speedMs] - ms per character
 * @returns {Promise<void>}
 */
export function typewrite(target, text, speedMs = 45) {
  target.textContent = "";

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");

  const textNode = document.createElement("span");
  textNode.className = "typed-text";

  target.appendChild(textNode);
  target.appendChild(cursor);

  // Accessible text for screen readers, present immediately regardless of
  // animation state.
  target.setAttribute("role", "text");
  target.setAttribute("aria-label", text);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    textNode.textContent = text;
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let i = 0;
    function step() {
      if (i < text.length) {
        textNode.textContent += text[i];
        i += 1;
        window.setTimeout(step, speedMs);
      } else {
        resolve();
      }
    }
    step();
  });
}
