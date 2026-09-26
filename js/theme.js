// theme.js — theme toggle + persistence.
//
// NOTE: the actual *pre-paint* theme application (reading localStorage and
// setting data-theme before first paint, to avoid a flash-of-wrong-theme)
// happens in a tiny inline <script> in the <head> of every page — it has to
// be inline and duplicated per-page so it runs before CSS/JS loads. This
// module only wires up the toggle button's click behavior after the DOM is
// ready; it does not duplicate the pre-paint logic.

const STORAGE_KEY = "theme";

export function getStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

export function setStoredTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    // localStorage unavailable (private mode, etc.) — theme just won't persist.
  }
}

export function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  setStoredTheme(theme);
}

export function toggleTheme() {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
