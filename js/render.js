// render.js — tiny shared helpers used across page scripts.
// No dependencies. Everything here is defensive about untrusted-looking
// JSON content: we always use textContent (never innerHTML) for data-driven
// text, so nothing in content/*.json can inject markup.

/**
 * Fetch and parse a JSON file. Throws with a friendly message on failure
 * (network error, bad status, or bad JSON) so callers can show fallback UI.
 * @param {string} path
 * @returns {Promise<any>}
 */
export async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch a plain-text file (used for markdown blog posts).
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function fetchText(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: HTTP ${res.status}`);
  }
  return res.text();
}

/**
 * Minimal element builder. Never sets HTML directly — attrs.html is the only
 * opt-in escape hatch, and it's only used for trusted, locally-authored
 * vendor output (e.g. marked() rendering our own markdown files).
 *
 * @param {string} tag
 * @param {object} [attrs]
 * @param {(Node|string)[]} [children]
 */
export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "html") {
      node.innerHTML = value;
    } else if (key === "text") {
      node.textContent = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "className") {
      node.className = value;
    } else {
      node.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (child === undefined || child === null || child === false) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }

  return node;
}

/**
 * Get a query-string parameter from the current page URL.
 * @param {string} name
 */
export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
