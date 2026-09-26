// work.js — renders the full resume from content/work.json into #work-content.
// All text comes from JSON and is inserted via textContent (see el() in
// render.js), never innerHTML, so nothing here can inject markup.

import { fetchJSON, el } from "./render.js";
import { initLayout } from "./layout.js";

const ICON_DOWNLOAD = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M7.25 1a.75.75 0 0 1 1.5 0v6.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V1Z"/><path d="M2 10.5a.75.75 0 0 1 .75.75v1.5c0 .41.34.75.75.75h9a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5A2.25 2.25 0 0 1 12.5 15h-9A2.25 2.25 0 0 1 1.25 12.75v-1.5A.75.75 0 0 1 2 10.5Z"/></svg>`;

function buildEntryCard({ role, company, period, location, bullets }) {
  return el("article", { className: "entry-card", tabindex: "0" }, [
    el("div", { className: "entry-head" }, [
      el("div", {}, [
        el("h3", { className: "entry-role" }, [
          role ? `${role} · ` : "",
          el("span", { className: "entry-company" }, [company || ""]),
        ]),
        location ? el("p", { className: "entry-location" }, [location]) : null,
      ]),
      period ? el("div", { className: "entry-meta" }, [period]) : null,
    ]),
    Array.isArray(bullets) && bullets.length
      ? el(
          "ul",
          { className: "entry-bullets" },
          bullets.map((b) => el("li", {}, [b]))
        )
      : null,
  ]);
}

function buildEducationCard({ school, degree, period, location, details }) {
  return el("article", { className: "entry-card", tabindex: "0" }, [
    el("div", { className: "entry-head" }, [
      el("div", {}, [
        el("h3", { className: "entry-role" }, [school || ""]),
        degree ? el("p", { className: "entry-location" }, [degree]) : null,
        location ? el("p", { className: "entry-location" }, [location]) : null,
      ]),
      period ? el("div", { className: "entry-meta" }, [period]) : null,
    ]),
    Array.isArray(details) && details.length
      ? el(
          "ul",
          { className: "entry-bullets" },
          details.map((d) => el("li", {}, [d]))
        )
      : null,
  ]);
}

function buildSkillCard({ category, items }) {
  return el("div", { className: "entry-card skill-card", tabindex: "0" }, [
    el("h3", { className: "skill-cat" }, [category || ""]),
    el(
      "div",
      { className: "skill-tags" },
      (items || []).map((item) => el("span", { className: "skill-tag" }, [item]))
    ),
  ]);
}

function buildSection(headingText, contentNodes) {
  return el("section", { className: "section-block" }, [
    el("h2", { className: "command-heading" }, [headingText]),
    ...contentNodes,
  ]);
}

async function init() {
  initLayout();

  const root = document.getElementById("work-content");
  const downloadLink = document.getElementById("resume-download");

  try {
    const data = await fetchJSON("./content/work.json");

    if (downloadLink && data.resumeFile) {
      downloadLink.href = data.resumeFile;
      downloadLink.innerHTML = `${ICON_DOWNLOAD}<span>download resume (pdf)</span>`;
    }

    const sections = [];

    if (data.summary) {
      sections.push(
        buildSection("summary", [
          el("div", { className: "entry-card", tabindex: "0" }, [
            el("p", { className: "summary-text" }, [data.summary]),
          ]),
        ])
      );
    }

    if (Array.isArray(data.experience) && data.experience.length) {
      sections.push(
        buildSection(
          "work_experience",
          data.experience.map(buildEntryCard)
        )
      );
    }

    if (Array.isArray(data.education) && data.education.length) {
      sections.push(
        buildSection(
          "education",
          data.education.map(buildEducationCard)
        )
      );
    }

    if (Array.isArray(data.skills) && data.skills.length) {
      sections.push(
        buildSection("skills", [
          el(
            "div",
            { className: "skills-grid" },
            data.skills.map(buildSkillCard)
          ),
        ])
      );
    }

    if (Array.isArray(data.achievements) && data.achievements.length) {
      sections.push(
        buildSection("achievements", [
          el("div", { className: "entry-card", tabindex: "0" }, [
            el(
              "ul",
              { className: "achievements-list" },
              data.achievements.map((a) => el("li", {}, [a]))
            ),
          ]),
        ])
      );
    }

    if (data.interests) {
      sections.push(
        buildSection("interests", [
          el("div", { className: "entry-card", tabindex: "0" }, [
            el("p", { className: "interests-text" }, [data.interests]),
          ]),
        ])
      );
    }

    root.append(...sections);
  } catch (err) {
    console.error(err);
    root.appendChild(
      el("div", { className: "entry-card" }, [
        el("p", { className: "summary-text" }, [
          "Resume content failed to load. Please make sure you're viewing this site over http(s), not file://.",
        ]),
      ])
    );
  }
}

init();
