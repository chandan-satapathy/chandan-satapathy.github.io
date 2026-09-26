// project.js — reads ?slug=... from the query string, looks it up in
// content/projects.json for metadata (title/date/tags/github), fetches
// content/blogs/<slug>.md, and renders it via the vendored `marked` parser.
//
// marked is loaded globally (js/vendor/marked.min.js, plain <script> tag) so
// it's available on `window.marked` before this module runs.

import { fetchJSON, fetchText, getQueryParam, el } from "./render.js";
import { initLayout } from "./layout.js";

const ICON_GITHUB = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;

function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function showError(message) {
  const main = document.getElementById("project-main");
  main.innerHTML = "";
  main.appendChild(
    el("div", { className: "error-state" }, [
      el("p", { className: "error-code" }, ["404"]),
      el("p", { className: "error-message" }, [message]),
      el("a", { className: "error-link", href: "./projects.html" }, ["← back to projects"]),
    ])
  );
}

async function init() {
  initLayout();

  const slug = getQueryParam("slug");

  if (!slug) {
    showError("No project specified. Pick one from the list.");
    return;
  }

  let projects = [];
  try {
    const data = await fetchJSON("./content/projects.json");
    projects = Array.isArray(data.projects) ? data.projects : [];
  } catch (err) {
    console.error(err);
    showError("Could not load project index. Please make sure you're viewing this site over http(s), not file://.");
    return;
  }

  const meta = projects.find((p) => p.slug === slug);

  if (!meta) {
    showError(`No project found for "${slug}".`);
    return;
  }

  document.title = `${meta.title} — Chandan Satapathy`;

  const headEl = document.getElementById("blog-header-content");
  headEl.appendChild(el("h1", { className: "blog-title" }, [meta.title || meta.slug]));

  const metaRow = el("div", { className: "blog-meta-row" }, [
    meta.date ? el("span", {}, [formatDate(meta.date)]) : null,
    meta.github
      ? el(
          "a",
          {
            className: "blog-github-link",
            href: meta.github,
            target: "_blank",
            rel: "noopener noreferrer",
            html: `${ICON_GITHUB} view on github →`,
          }
        )
      : null,
  ]);
  headEl.appendChild(metaRow);

  if (Array.isArray(meta.tags) && meta.tags.length) {
    headEl.appendChild(
      el(
        "div",
        { className: "blog-tags" },
        meta.tags.map((t) => el("span", { className: "skill-tag" }, [t]))
      )
    );
  }

  const bodyEl = document.getElementById("blog-body");

  try {
    const md = await fetchText(`./content/blogs/${slug}.md`);
    if (typeof window.marked === "undefined") {
      throw new Error("marked library failed to load");
    }
    // Trusted local content authored by us — safe to render as HTML.
    bodyEl.innerHTML = window.marked.parse(md);
  } catch (err) {
    console.error(err);
    showError(`Could not load the write-up for "${slug}".`);
    return;
  }

  bodyEl.appendChild(
    el("a", { className: "blog-back-link", href: "./projects.html" }, ["← back to all projects"])
  );
}

init();
