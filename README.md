# chandan-satapathy.dev — personal portfolio

A static, dependency-free portfolio site. No build step, no framework —
plain HTML/CSS/JS that you can edit directly and deploy straight to GitHub
Pages. All page content (text, resume data, project list, blog posts) lives
in `content/`, not in the markup, so updating the site rarely means touching
HTML or JS.

## File map

```
/
├── index.html              landing page (typewriter intro)
├── work.html               resume, rendered from content/work.json
├── projects.html           project list, rendered from content/projects.json
├── project.html            single project write-up (?slug=...), renders content/blogs/<slug>.md
├── 404.html                themed "page not found" (used by GitHub Pages automatically)
├── .nojekyll               tells GitHub Pages to serve files as-is (no Jekyll processing)
├── assets/
│   ├── resume/
│   │   └── Chandan_Satapathy_Resume.pdf   the downloadable resume PDF
│   └── images/             drop project screenshots etc. here
├── content/                 <-- EDIT THIS for all text/content changes
│   ├── home.json            landing page copy
│   ├── work.json            full resume data
│   ├── projects.json        project list metadata
│   └── blogs/
│       ├── _template.md     copy this to start a new project write-up
│       ├── snitch.md, persist.md, book-notes.md, whatsapp-notes.md   project posts
│       └── (see BLOG_STYLE.md at the repo root for how to write one)
├── css/
│   ├── base.css             reset, theme variables (light/dark), typography
│   ├── layout.css           header/nav/footer chrome
│   └── pages.css            page-specific styles
└── js/
    ├── theme.js              theme toggle logic + localStorage persistence
    ├── layout.js             injects header/footer on every page (single link config)
    ├── typewriter.js         reusable typing animation
    ├── render.js             tiny fetch/DOM-builder helpers
    ├── home.js / work.js / projects.js / project.js   page-specific renderers
    └── vendor/
        └── marked.min.js     vendored markdown parser (no CDN dependency)
```

## Editing workflows

### 1. Update the landing page copy
Edit `content/home.json`:
- `typewriter` — the line that types out under the name.
- `summary` — the paragraph that fades in afterwards.
- `quickLinks` — the small `$ view work` / `$ browse projects` links.

No HTML/JS changes needed.

### 2. Update the resume / work page
Edit `content/work.json`. The schema:
- `contact` — email, location, github, linkedin (shown implicitly via header/footer links; kept here for reference/reuse).
- `resumeFile` — path to the PDF served by the download button.
- `summary` — top paragraph.
- `experience` — array of `{ company, role, period, location, bullets[] }`.
- `education` — array of `{ school, degree, period, location, details[] }`.
- `skills` — array of `{ category, items[] }` — renders as tag chips grouped by category.
- `achievements` — array of strings.
- `interests` — a single string/paragraph.

Add, remove, or reorder array entries freely — `work.js` renders whatever is
in the file, in order. No HTML changes needed.

### 3. Swap the resume PDF
Replace the file at `assets/resume/Chandan_Satapathy_Resume.pdf` with your
new PDF (keep the same filename, or update `resumeFile` in
`content/work.json` to point at a new filename).

### 4. Add a new project write-up (3 steps)
1. Copy `content/blogs/_template.md` to `content/blogs/<your-slug>.md`
   (slug = lowercase, hyphenated, URL-safe — this becomes `?slug=<your-slug>`).
2. Write your post in Markdown (headings, lists, code blocks, links,
   blockquotes, and images are all supported and styled).
3. Add a matching entry to `content/projects.json` under `"projects"`:
   ```json
   {
     "slug": "your-slug",
     "title": "Your Project Title",
     "date": "2026-07-06",
     "description": "One line describing the project.",
     "tags": ["python", "postgres"],
     "github": "https://github.com/chandan-satapathy/your-repo",
     "featured": false
   }
   ```
   `slug` **must** match the markdown filename (without `.md`). Set
   `"featured": true` to pin it to the top of the list with a badge.

That's it — `projects.html` will pick it up automatically, and
`project.html?slug=your-slug` will render it.

### 5. Update nav links, social links, or email
Edit the `LINKS` object and `NAV_ITEMS` array at the top of `js/layout.js`.
This is the single source of truth — header and footer both read from it, so
there's no duplicated markup to keep in sync.

### 6. Change the theme colors
Edit the CSS custom properties in `css/base.css` under `:root,
[data-theme="light"]` and `[data-theme="dark"]`. Everything else (buttons,
borders, hover states) derives from those variables.

## Local preview

Browsers block `fetch()` of local JSON/Markdown files under `file://`, so
you must serve the site over HTTP. From the repo root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in your browser. Every page, JSON file,
markdown post, and the vendored `marked.min.js` should load with no console
errors. Stop the server with `Ctrl+C`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `github.com/chandan-satapathy/website` or
   `chandan-satapathy.github.io` for a user site).
2. Push this directory to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/chandan-satapathy/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
5. Save. GitHub Pages will build and publish the site (usually within a
   minute). Your site will be live at:
   - `https://chandan-satapathy.github.io/` (if the repo is named
     `chandan-satapathy.github.io`), or
   - `https://chandan-satapathy.github.io/<repo-name>/` (project page — this is why
     every internal link in this site uses **relative paths**, so it works
     at either root or a subpath without any changes).
6. `.nojekyll` is already included so GitHub Pages serves files (including
   any starting with `_`, like `_template.md`) verbatim without running them
   through Jekyll.
7. `404.html` is picked up automatically by GitHub Pages and shown for any
   unmatched URL under your Pages domain.

## Notes

- Everything is vanilla HTML/CSS/JS — no npm, no bundler, no build step.
- The only vendored dependency is `js/vendor/marked.min.js` (markdown
  parser), pinned locally so the site has no runtime CDN dependency.
- All JSON-driven text is inserted via `textContent`, never `innerHTML`, so
  editing `content/*.json` can never accidentally inject markup. Markdown
  files are trusted local content and are rendered as HTML via `marked`.
- Default theme is light; the toggle persists your choice in
  `localStorage` and a small inline script in each page's `<head>` applies
  it before first paint to avoid a flash of the wrong theme.
