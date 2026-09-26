// layout.js — injects header + footer into every page.
//
// This is the single source of truth for nav/footer links. No page markup
// repeats this HTML; every page calls `initLayout()` on load.

import { el } from "./render.js";
import { getCurrentTheme, toggleTheme } from "./theme.js";

// ---- Single source of truth for links --------------------------------------
const LINKS = {
  github: "https://github.com/Csatapathy",
  linkedin: "https://linkedin.com/in/chandan-satapathy",
  email: "satapathy.chandan1008@gmail.com",
};

const NAV_ITEMS = [
  { label: "home", href: "./index.html", match: ["", "index.html"] },
  { label: "work", href: "./work.html", match: ["work.html"] },
  { label: "projects", href: "./projects.html", match: ["projects.html", "project.html"] },
];

// ---- Icons (inline SVG, currentColor so they theme automatically) ---------
const ICON_GITHUB = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;

const ICON_LINKEDIN = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M14.82 0H1.18C.53 0 0 .52 0 1.16v13.68C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.16V1.16C16 .52 15.47 0 14.82 0ZM4.75 13.63H2.37V6.0h2.38v7.63ZM3.56 4.96a1.38 1.38 0 1 1 0-2.76 1.38 1.38 0 0 1 0 2.76Zm10.07 8.67h-2.37V9.9c0-.9-.02-2.07-1.26-2.07-1.27 0-1.46.99-1.46 2v3.8H6.17V6.0h2.28v1.04h.03c.32-.6 1.1-1.24 2.26-1.24 2.42 0 2.87 1.6 2.87 3.66v4.17Z"/></svg>`;

const ICON_MAIL = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M1.5 3h13A1.5 1.5 0 0 1 16 4.5v7A1.5 1.5 0 0 1 14.5 13h-13A1.5 1.5 0 0 1 0 11.5v-7A1.5 1.5 0 0 1 1.5 3Zm0 1v.2l6.5 4.06L14.5 4.2V4h-13Zm13 1.43-6.24 3.9a.5.5 0 0 1-.52 0L1.5 5.43V11.5h13V5.43Z"/></svg>`;

const ICON_SUN = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 11.5A3.5 3.5 0 1 0 8 4.5a3.5 3.5 0 0 0 0 7ZM8 0a.75.75 0 0 1 .75.75V2a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0Zm0 14a.75.75 0 0 1 .75.75V16a.75.75 0 0 1-1.5 0v-1.25A.75.75 0 0 1 8 14Zm8-6a.75.75 0 0 1-.75.75H14a.75.75 0 0 1 0-1.5h1.25A.75.75 0 0 1 16 8ZM2 8a.75.75 0 0 1-.75.75H0a.75.75 0 0 1 0-1.5h1.25A.75.75 0 0 1 2 8Zm11.31-5.31a.75.75 0 0 1 0 1.06l-.88.89a.75.75 0 1 1-1.06-1.06l.88-.89a.75.75 0 0 1 1.06 0ZM4.63 11.42a.75.75 0 0 1 0 1.06l-.88.89a.75.75 0 1 1-1.06-1.06l.88-.89a.75.75 0 0 1 1.06 0Zm8.68 1.95a.75.75 0 0 1-1.06 0l-.88-.89a.75.75 0 1 1 1.06-1.06l.88.89a.75.75 0 0 1 0 1.06ZM3.75 3.75a.75.75 0 0 1-1.06 0l-.88-.89a.75.75 0 1 1 1.06-1.06l.88.89a.75.75 0 0 1 0 1.06Z"/></svg>`;

const ICON_MOON = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.02.06A7.5 7.5 0 1 0 15.94 10a.75.75 0 0 0-.88-.9 6 6 0 0 1-7.16-7.16.75.75 0 0 0-.9-.88Z"/></svg>`;

function currentPageFile() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf("/") + 1);
  return file;
}

function buildHeader() {
  const page = currentPageFile();

  const siteMark = el("a", { href: "./index.html", className: "site-mark", "aria-label": "Home" }, [
    "cs@web:~",
    el("span", { className: "blink" }, ["$"]),
  ]);

  const navLinks = el(
    "div",
    { className: "nav-links" },
    NAV_ITEMS.map((item) => {
      const isActive = item.match.includes(page);
      return el("a", {
        href: item.href,
        ...(isActive ? { "aria-current": "page" } : {}),
      }, [item.label]);
    })
  );

  const iconLinks = el("div", { className: "icon-links" }, [
    el("a", {
      href: LINKS.linkedin,
      className: "icon-link",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "LinkedIn profile",
      html: ICON_LINKEDIN,
    }),
    el("a", {
      href: LINKS.github,
      className: "icon-link",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "GitHub profile",
      html: ICON_GITHUB,
    }),
  ]);

  const themeToggle = buildThemeToggle();

  const navCluster = el("div", { className: "nav-cluster" }, [navLinks, iconLinks, themeToggle]);

  navCluster.setAttribute("role", "navigation");
  navCluster.setAttribute("aria-label", "Primary");

  const container = el("div", { className: "container" }, [siteMark, navCluster]);

  return el("header", { className: "site-header" }, [container]);
}

function themeToggleIcon(theme) {
  return theme === "dark" ? ICON_SUN : ICON_MOON;
}

function themeToggleLabelText(theme) {
  return theme === "dark" ? "light" : "dark";
}

function buildThemeToggle() {
  const theme = getCurrentTheme();
  const button = el("button", {
    type: "button",
    className: "theme-toggle",
    id: "theme-toggle",
    "aria-label": "Toggle color theme",
    html: `${themeToggleIcon(theme)}<span class="toggle-label">${themeToggleLabelText(theme)}</span>`,
  });

  button.addEventListener("click", () => {
    const next = toggleTheme();
    button.innerHTML = `${themeToggleIcon(next)}<span class="toggle-label">${themeToggleLabelText(next)}</span>`;
  });

  return button;
}

function buildFooter() {
  const page = currentPageFile();
  const year = new Date().getFullYear();

  const navLinks = el(
    "div",
    { className: "nav-links" },
    NAV_ITEMS.map((item) => {
      const isActive = item.match.includes(page);
      return el("a", {
        href: item.href,
        ...(isActive ? { "aria-current": "page" } : {}),
      }, [item.label]);
    })
  );

  const iconLinks = el("div", { className: "icon-links" }, [
    el("a", {
      href: LINKS.linkedin,
      className: "icon-link",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "LinkedIn profile",
      html: ICON_LINKEDIN,
    }),
    el("a", {
      href: LINKS.github,
      className: "icon-link",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "GitHub profile",
      html: ICON_GITHUB,
    }),
    el("a", {
      href: `mailto:${LINKS.email}`,
      className: "icon-link",
      "aria-label": "Email me",
      html: ICON_MAIL,
    }),
  ]);

  const topRow = el("div", { className: "footer-row" }, [navLinks, iconLinks]);
  const tagline = el("p", { className: "footer-tagline" }, [
    `© ${year} Chandan Satapathy · built by hand, no frameworks`,
  ]);

  const container = el("div", { className: "container" }, [topRow, tagline]);
  return el("footer", { className: "site-footer" }, [container]);
}

/**
 * Injects header + footer into #layout-header / #layout-footer mount points,
 * which every page must include as empty containers.
 */
export function initLayout() {
  const headerMount = document.getElementById("layout-header");
  const footerMount = document.getElementById("layout-footer");

  if (headerMount) {
    headerMount.replaceWith(buildHeader());
  }
  if (footerMount) {
    footerMount.replaceWith(buildFooter());
  }
}

export { LINKS };
