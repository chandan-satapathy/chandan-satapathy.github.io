# Portfolio Website — Implementation Plan

Personal portfolio for **Chandan Satapathy**, backend engineer. Static site for GitHub Pages. No build step, no framework — vanilla HTML/CSS/JS, fully editable by hand.

## 1. Goals & constraints

- **Static only.** Must work on GitHub Pages with zero build tooling. Use relative paths everywhere (`./content/...`, not `/content/...`) so it works at both `csatapathy.github.io` and project-page subpaths.
- **Content lives in data files, not markup.** All editable text goes in JSON under `content/`; project blog posts are Markdown under `content/blogs/`. HTML pages are dumb shells that render data.
- **DRY.** Header and footer are built once in JS and injected on every page. Theme, typewriter, markdown rendering are shared modules. No copy-pasted nav markup across pages.
- **Responsive.** Looks polished on phones (~375px) and laptops. Mobile nav collapses gracefully (icons stay, text links can compress; a hamburger is NOT required if the nav fits — prefer keeping all links visible with tighter spacing).
- **Aesthetic: terminal / developer vibe, light by default.**

## 2. Design language (terminal vibe, light-first)

- **Fonts:** `JetBrains Mono` (Google Fonts) for headings, nav, and accents; `Inter` (or system sans) for body prose so long text stays readable. Load via `<link>` with `display=swap`.
- **Light theme (default):** paper-white/off-white background (`#fafaf7`-ish), near-black ink text, terminal-green accent (`#0a7d33`-ish range — pick something with good contrast on light bg). Subtle 1px borders, no heavy shadows.
- **Dark theme:** classic terminal — very dark background (`#0d1117`-ish), light gray text, brighter green accent (`#3ddc84` / `#4af626` family, toned for readability).
- **Terminal flourishes (tasteful, not kitsch):**
  - Landing page name preceded by a prompt glyph, e.g. `~$ chandan_satapathy` or similar treatment.
  - Typewriter line ends with a blinking block cursor (`▮`) via CSS animation.
  - Section headings in work/projects pages styled like commands, e.g. `> work_experience`, `> projects --list`.
  - Links get a `[ ]` bracket or underline-on-hover treatment; hover states use the accent color.
- **Theme implementation:** CSS custom properties on `:root` / `[data-theme="dark"]`. An **inline script in `<head>` of every page** (tiny, duplicated by necessity — comment it as such) reads `localStorage.theme` and sets `data-theme` before first paint to avoid flash. Default is **light** (do NOT follow `prefers-color-scheme`). Toggle button in header swaps theme and persists to `localStorage`. Toggle icon: sun/moon SVG, or a terminal-y `[light]`/`[dark]` text button — implementer's choice, keep it clean.

## 3. File structure

```
/ (repo root = /Users/chandansatapathy/Code/website)
├── index.html              # landing / home
├── work.html               # resume page
├── projects.html           # projects list (blog index)
├── project.html            # single project blog (renders ?slug=...)
├── 404.html                # simple themed 404 (GH Pages picks it up)
├── .nojekyll               # so GH Pages serves files verbatim
├── README.md               # how to edit content, add projects, run locally, deploy
├── PLAN.md                 # this file
├── assets/                 # ALL attachments live here (user-editable)
│   ├── resume/
│   │   └── Chandan_Satapathy_Resume.pdf
│   └── images/             # future project screenshots etc. (keep a .gitkeep)
├── content/                # ALL editable text lives here
│   ├── home.json
│   ├── work.json
│   ├── projects.json
│   └── blogs/
│       ├── _template.md            # commented example for future posts
│       ├── sample-project-one.md
│       └── sample-project-two.md
├── css/
│   ├── base.css            # reset, CSS variables (both themes), typography, utilities
│   ├── layout.css          # header, nav, footer, page container
│   └── pages.css           # page-specific styles (landing, work, projects, blog)
└── js/
    ├── theme.js            # toggle + persistence (head script handles pre-paint)
    ├── layout.js           # injects header + footer into every page, marks active nav link
    ├── typewriter.js       # reusable typewriter effect
    ├── render.js           # tiny shared helpers (fetch JSON, el() builder, escape)
    ├── home.js             # landing page logic
    ├── work.js             # renders resume from work.json
    ├── projects.js         # renders project list from projects.json
    ├── project.js          # loads blog md by slug, renders via marked
    └── vendor/
        └── marked.min.js   # vendored markdown parser (download from CDN, pin version)
```

**Rules:**
- Vendor `marked.min.js` locally (no runtime CDN dependency). Get the latest stable UMD build from `https://cdn.jsdelivr.net/npm/marked/marked.min.js`.
- Every page includes: head pre-paint theme snippet, `css/*`, then `layout.js` + page script as `<script type="module">` or plain deferred scripts (implementer's choice; keep it consistent).
- `layout.js` owns the single source of truth for nav/footer links (one config object: Home, Work, Projects, LinkedIn, GitHub, email).

## 4. Pages

### 4.1 Landing (`index.html`) — also the "Home" nav target
- Centered hero. Prompt-styled name: **CHANDAN SATAPATHY**.
- Below the name, **typewriter animation** types out: `Welcome to my little corner on the Internet.` (text sourced from `home.json`, not hardcoded), with blinking block cursor that persists after typing finishes.
- Below that, a short "who I am" summary paragraph from `home.json` (fades in after the typewriter completes, or is simply present — implementer's call, keep it smooth).
- Optionally 2–3 quick links (e.g., "view work →", "browse projects →") styled as terminal commands.

`content/home.json`:
```json
{
  "name": "Chandan Satapathy",
  "typewriter": "Welcome to my little corner on the Internet.",
  "summary": "I'm a backend engineer with 3+ years of experience building distributed systems at Udaan — India's largest B2B e-commerce platform. I've owned warehouse management systems end to end: inventory tracking, logistics dispatch, and asset reconciliation at scale. I care about performant databases, clean architecture, and observability. Off the keyboard, I read novels and mythology, follow finance and international affairs, and still enjoy competitive programming.",
  "quickLinks": [
    { "label": "view work", "href": "./work.html" },
    { "label": "browse projects", "href": "./projects.html" }
  ]
}
```
(Feel free to lightly polish the summary wording, keep first person, ~3 sentences.)

### 4.2 Work (`work.html`)
- Page title styled like a command (e.g. `> cat resume`).
- **Download button** with a download SVG icon, prominent near the top, linking to `assets/resume/Chandan_Satapathy_Resume.pdf` with the `download` attribute.
- Full resume rendered from `work.json` in a modern responsive layout:
  - Sections: Summary, Work Experience, Education, Skills, Achievements, Interests.
  - Each **section and each entry (job, school) is a hoverable card/block**: on hover (and `:focus-within` for keyboard), it highlights — accent-colored left border + subtle background tint + smooth transition. On touch devices there's no hover; blocks just look clean (do not require hover for readability).
  - Two-column on desktop where it helps (e.g., dates right-aligned against role/company), single column stack on mobile.
- `content/work.json` schema — structure it so editing is obvious:
```json
{
  "contact": {
    "email": "satapathy.chandan1008@gmail.com",
    "location": "Bengaluru, India",
    "github": "https://github.com/Csatapathy",
    "linkedin": "https://linkedin.com/in/chandan-satapathy"
  },
  "resumeFile": "./assets/resume/Chandan_Satapathy_Resume.pdf",
  "summary": "...",
  "experience": [
    {
      "company": "UIX Labs",
      "role": "Software Consultant",
      "period": "Mar 2026 – Present",
      "location": "Remote",
      "bullets": ["..."]
    }
  ],
  "education": [ { "school": "...", "degree": "...", "period": "...", "location": "...", "details": ["..."] } ],
  "skills": [ { "category": "Languages", "items": ["Kotlin", "Java", "..."] } ],
  "achievements": ["..."],
  "interests": "..."
}
```
- **Populate `work.json` with the real resume data below (Section 7), faithfully and completely** — all companies, roles, bullets, education, skills, achievements, interests.

### 4.3 Projects (`projects.html`)
- Blog-index format: a vertical list of entries from `content/projects.json`. Each entry: title, date, one-line description, tags. Entire card clickable → `project.html?slug=<slug>`.
- Cards get the same hover-highlight treatment as the work page.
- `content/projects.json`:
```json
{
  "projects": [
    {
      "slug": "sample-project-one",
      "title": "Sample Project One",
      "date": "2026-01-15",
      "description": "A placeholder entry — one line about what this project does and why it exists.",
      "tags": ["python", "fastapi"],
      "github": "https://github.com/Csatapathy",
      "featured": true
    },
    {
      "slug": "sample-project-two",
      "title": "Sample Project Two",
      "date": "2025-11-02",
      "description": "Another placeholder — replace me by editing content/projects.json.",
      "tags": ["kotlin", "distributed-systems"],
      "github": "https://github.com/Csatapathy",
      "featured": false
    }
  ]
}
```
- **Placeholders only** — two sample entries demonstrating the format. Do not invent real projects.

### 4.4 Project blog (`project.html`)
- Reads `slug` from the query string, looks it up in `projects.json` (title, date, tags, github link for the header), fetches `content/blogs/<slug>.md`, renders with vendored `marked`.
- Blog header: title, date, tags, prominent "view on github →" link.
- Markdown content styled nicely for both themes: headings, code blocks (monospace, subtle background), lists, links, blockquotes, images (max-width 100%).
- Unknown/missing slug → friendly themed error with a link back to `projects.html`.
- `content/blogs/_template.md` documents the workflow in comments: copy this file, name it `<slug>.md`, add a matching entry in `projects.json`.
- Write the two sample blog `.md` files with obviously-placeholder but well-structured content (intro, a "highlights" section, a code snippet, a link to GitHub) so the styling is demonstrable.

### 4.5 404 page
- Minimal: `404: page not found` in terminal style, `cd ~` link back home. Same header/footer.

## 5. Shared chrome

### Header (injected by `layout.js` on every page)
Left: site mark (e.g. `cs@web:~$` or `~/chandan` — small, clickable → home).
Right: `home` · `work` · `projects` · LinkedIn icon · GitHub icon · theme toggle.
- Text links for pages; **inline SVG icons** for LinkedIn and GitHub (official-ish simple glyphs, `currentColor` fill so they theme automatically). External links open in new tab with `rel="noopener"`.
- Active page link visually marked (accent color / underline).
- Sticky top, backdrop blur or solid bg, thin bottom border.
- Mobile: same row, tighter spacing; wrap if needed. Must not overflow at 360px width.

### Footer (injected by `layout.js`)
- Same links as header **plus** an email link (`mailto:satapathy.chandan1008@gmail.com`, with a mail icon or `email` text link).
- A small line like `© 2026 Chandan Satapathy · built by hand, no frameworks` (keep it tasteful).

### Links config (single source of truth in `layout.js`)
- GitHub: `https://github.com/Csatapathy`
- LinkedIn: `https://linkedin.com/in/chandan-satapathy`
- Email: `satapathy.chandan1008@gmail.com`

## 6. Implementation notes & pitfalls

- `fetch()` of JSON/MD fails on `file://` — document in README: preview with `python3 -m http.server` from repo root. Verify all pages against a local server before finishing.
- Add `<meta name="viewport">`, sensible `<title>` per page, meta description, and favicon (a simple inline-SVG terminal-prompt favicon, e.g. green `>_` — data URI or `assets/images/favicon.svg`).
- Accessibility: semantic landmarks (`header/nav/main/footer`), `aria-label` on icon links and theme toggle, visible focus states, `prefers-reduced-motion` → skip typewriter animation and show full text instantly.
- Typewriter: reusable function `typewrite(el, text, speedMs)`, returns a promise; cursor is a CSS-animated `::after` or span.
- Keep JS dependency-free apart from vendored `marked`. No jQuery, no CDN runtime deps.
- Escape/never inject untrusted HTML from JSON (use `textContent` in renderers); markdown is trusted local content.
- **Copy the resume PDF** from `/Users/chandansatapathy/Downloads/Resume stuff/Chandan Satapathy Backend.pdf` to `assets/resume/Chandan_Satapathy_Resume.pdf`.
- README.md must cover: file map, how to edit each JSON, how to add a project blog (3 steps), how to swap the resume PDF, local preview command, and how to deploy to GitHub Pages (create repo, push, enable Pages on main branch root).
- Do NOT run `git init` or commit — the user will handle the repo.

## 7. Resume data (transcribe faithfully into `content/work.json`)

**Contact:** satapathy.chandan1008@gmail.com · Bengaluru, India · github.com/Csatapathy · linkedin.com/in/chandan-satapathy
(Do not publish the phone number on the website.)

**Summary:** Backend Engineer with 3+ years of experience at Udaan.com — India's largest B2B e-commerce platform, serving 3M+ retailers across 900+ cities. As the sole engineer accountable for Warehouse Management System reliability and roadmap, designed and shipped distributed systems spanning inventory tracking, logistics dispatch, and asset reconciliation at scale. Reduced total infrastructure cost by ~20%, improved picking throughput by 50%, and cut P0 detection time by 40% through database performance engineering, microservices architecture and observability. Proficient in Kotlin, Python, TypeScript, Java and cloud-native systems on Azure & AWS, with a strong foundation in data structures, algorithms, and system design.

**Experience:**

*UIX Labs — Software Consultant — Mar 2026 – Present — Remote*
- Delivering backend architecture and feature development across multiple client projects spanning warehouse management and logistics.

*Udaan.com — Software Engineer 2 — Aug 2024 – Sept 2025 — Bangalore*
- Owned Warehouse Management & Storage Systems (WMS) powering Udaan's B2B supply chain across 20+ warehouses, processing millions of inventory events daily.
- Mentored 2 graduate engineers over 12 months through weekly 1:1s and code reviews; both reached independent sub-system ownership within 6 months.
- Designed and owned Double Dispatch — a parallelised last-mile logistics system — in Kotlin and TypeScript, enabling concurrent last-mile manifest generation across multiple route batches and improving dispatch throughput by ~30% without any additional infrastructure. Led cross-functional design sync with ops and logistics teams to align on dispatch SLAs before implementation.
- Diagnosed parameter-sniffing and missing-index root causes behind query performance degradation and CPU spikes in Azure SQL and CosmosDB — profiled execution plans, redesigned indexes aligned to actual usage patterns, cutting CPU requirements from 32 to 16 cores (50% cost reduction).
- Planned and executed the Asset Receipt Note (ARN) system with concurrency-safe distributed locks given write-heavy, multi-site access patterns; designed CosmosDB bulk upserts for idempotent tote reconciliation; schema supports eventual consistency across 20+ warehouse sites with reconciliation SLAs.
- Contributed to the Fresh vertical platform migration, realigning 15+ legacy warehouse flows with a new distributed architecture — achieving 50% improvement in ground picking times and 80% increase in item accountability.
- Designed idempotent data archival and entity demerger jobs migrating org-level inventory across microservices, reducing active table sizes by ~40% and cutting long-tail query latency on high-cardinality tables.
- Established SLO-aligned error limits and built Prometheus-based observability across 4+ microservices — 4xx/5xx alerts, Jetty request alerts, Slack pipelines — reducing mean time to detection (MTTD) for P0 incidents by ~40%.
- Implemented retry logic, timeouts, and circuit-breaker patterns across Picklist and archival workflows — reducing on-call escalations by ~25% quarter-over-quarter.

*Udaan.com — Software Engineer 1 — Aug 2022 – Aug 2024 — Bangalore*
- Built an anomaly detection framework (Python, Prophet algorithm) integrated into the warehouse data pipeline, reducing system availability drops by 30% across 100K+ daily procurement records.
- Resolved critical CosmosDB throttling by refactoring query patterns and batching bulk writes — reducing throttling events by 37% and cutting cloud DB costs on a high-frequency write workload.
- Designed real-time operational dashboards in React and TypeScript for ground teams, monitoring picking efficiency, failure rates, and warehouse health — adopted across 5+ sites by 100+ ops users.
- Expanded unit and integration test coverage by 25% across the WMS codebase — migrating 50+ test suites to JUnit 5, reducing production deployment regressions.

*Enthire Co. — Machine Learning Intern — Jan 2021 – July 2021 — Remote*
- Developed production ML models and REST APIs (Python, FastAPI), reducing prediction time lag by 80% and improving accuracy from ~78% to 94% via feature engineering with Scikit-Learn and TensorFlow.
- Built a 1-click AWS deployment module from scratch — auto-provisioning FastAPI backends, containerizing with Docker, and rendering a Streamlit monitoring dashboard — reducing deployment setup from 4+ hours to under 5 minutes (98% reduction).

**Education:**

*National Institute of Technology, Kurukshetra — B.Tech, Electrical Engineering — Aug 2018 – May 2022 — Kurukshetra, Haryana*
- CGPA: 9.16/10
- Competitive programmer; Electroreck Tech Club Core Member (4 years); Debate Club

*Ryan International School — Senior Secondary (PCM + Economics) — May 2018 — Gurgaon, Haryana*
- Senior Secondary: 94.4% | Secondary: 10/10 CGPA

**Skills:**
- Languages: Kotlin, Java, Python, JavaScript, TypeScript, Dart
- Databases: Azure SQL, CosmosDB, MongoDB, MySQL, Redis
- Frameworks: FastAPI, Flask, Django, Pyramid, Flutter, Terraform
- Cloud: Microsoft Azure, AWS (Lambda, EC2, S3), Google Cloud Platform, Serverless
- ML / Data: TensorFlow, Scikit-Learn, Pandas, NumPy, SciPy, Matplotlib, Docker
- Core CS: Distributed Systems, System Design, Data Structures & Algorithms, Concurrency, TDD, CI/CD

**Achievements:**
- Google Hash Code 2021 — Global Rank 2,613 out of hundreds of thousands of participants worldwide.
- HackerRank Algorithms — Rank 3,210 / 3.4M+ (top 0.01% globally); CodeChef September Challenge 2020 — Global Rank 357 / 30,000.

**Interests:** Finance, economics & international affairs; competitive programming; avid reader of novels and mythology.

## 8. Definition of done

1. All files per Section 3 exist; no dead links between pages.
2. `python3 -m http.server` from repo root: every page loads without console errors; JSON/MD fetches succeed; typewriter runs on landing; theme toggle persists across pages and reloads; light is the default.
3. Resume page shows full resume content, hover highlighting works, download link serves the PDF.
4. Projects list renders both placeholders; clicking opens the blog page with rendered markdown; bad slug shows the friendly error.
5. Responsive at 360px, 768px, 1280px — no horizontal overflow, nav usable at all sizes.
6. README explains every editing workflow.
