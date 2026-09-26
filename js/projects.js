// projects.js — renders the blog-style project list from content/projects.json.

import { fetchJSON, el } from "./render.js";
import { initLayout } from "./layout.js";

function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function buildProjectCard(project) {
  const card = el(
    "a",
    {
      className: "project-card",
      href: `./project.html?slug=${encodeURIComponent(project.slug)}`,
    },
    [
      el("div", { className: "project-card-head" }, [
        el("h2", { className: "project-title" }, [
          project.title || project.slug,
          project.featured ? el("span", { className: "featured-badge" }, ["featured"]) : null,
        ]),
        project.date ? el("span", { className: "project-date" }, [formatDate(project.date)]) : null,
      ]),
      project.description ? el("p", { className: "project-desc" }, [project.description]) : null,
      Array.isArray(project.tags) && project.tags.length
        ? el(
            "div",
            { className: "project-tags" },
            project.tags.map((t) => el("span", { className: "skill-tag" }, [t]))
          )
        : null,
    ]
  );
  return card;
}

async function init() {
  initLayout();

  const root = document.getElementById("projects-list");

  try {
    const data = await fetchJSON("./content/projects.json");
    const projects = Array.isArray(data.projects) ? data.projects : [];

    if (!projects.length) {
      root.appendChild(el("p", { className: "empty-state" }, ["No projects yet — check back soon."]));
      return;
    }

    // Featured first, then by date descending.
    const sorted = [...projects].sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      return new Date(b.date) - new Date(a.date);
    });

    root.append(...sorted.map(buildProjectCard));
  } catch (err) {
    console.error(err);
    root.appendChild(
      el("p", { className: "empty-state" }, [
        "Projects failed to load. Please make sure you're viewing this site over http(s), not file://.",
      ])
    );
  }
}

init();
