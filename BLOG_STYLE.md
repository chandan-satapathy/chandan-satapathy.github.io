# Blog style guide

How to write the project posts on this site. There is one post per project, written as me (Chandan) and built from my Obsidian project notes. Read this before writing or editing a post.

The tone model is Dewansh Rawat's "Building Aegis" post. It opens on a problem everyone recognises and uses short, punchy sentences. Each section ends with a GIF and a one-line caption that lands the point. Our posts are longer and more hands-on than that one. They're build stories, so each post should teach the reader something they can reuse.

## 1. Voice

- **First person, as me.** Use "I" for my decisions and experience, and "we" for me and Claude doing the build together. Name the model when it matters: "Opus wrote the spec, Sonnet wrote the code."
- **Be upfront that Claude agents wrote most of the code.** That's the point of the series, not a secret. Never imply I hand-wrote something the notes say an agent wrote.
- **Talk to a developer friend.** Frame the problem with "you". Use plain words, and explain a term the first time in a short clause: "a geofence, an invisible circle around a place that your phone watches."
- **Keep it short and punchy.** Paragraphs are 2–4 sentences, mixing longer sentences with short ones. Fragments are fine. A question can be answered in three words.
- **Be funny about the work.** Laugh at the bugs, the process and myself, never at people. Dry beats loud: one good joke per section is plenty.
- **Specific beats general.** Use real numbers, real error messages and real dates from the notes. "Tests went from 14 to 200" beats "lots of tests".
- **Every section leaves the reader something to use:** a pattern, a trick or a warning.

> Do: "All 225 tests were green. The geofence still wouldn't arm on my phone."
>
> Don't: "In this post I'll take you on a journey through building a revolutionary productivity app."

Avoid "journey", "game-changer", "seamless", "revolutionary", "leverage", "in today's fast-paced world" and "In conclusion". No emoji in headings, and at most one exclamation mark per post.

## 2. Structure

Aim for 700–800 words of body text, not counting alt text or code. (The Snitch post came before this limit and runs to about 1,470; the limit applies to every post after it.) Keep the sections in this order. Rename a heading when a more specific one fits the post; a heading that names the actual trade-off beats a generic "Benefits". Each section must still do its job.

| # | Section | Default heading | Words | What goes in it |
|---|---|---|---|---|
| 1 | Hook | *(none)* | ~100 | The problem as the reader would feel it, drawn from "Why I built it". End with "So I built X", a one-line promise, then the first GIF. |
| 2 | What it does | `## What it does` | ~80 | About 5 bullets: **Feature** — one line each. |
| 3 | How it works | `## How it works` | ~130 | The stack and the moving parts in plain words, one short paragraph or bullet per part. At most one small code snippet, only if it teaches something. |
| 4 | The calls we made | `## The calls we made` | ~130 | 2–3 decisions, each "chose X over Y because Z". Say who drove it: me, or Claude's suggestion that I accepted. |
| 5 | What broke | `## What broke (and how we fixed it)` | ~150 | 2–3 bugs. Each one: bold one-line symptom, then cause, fix and a one-line lesson. |
| 6 | What went right | `## What went right` | ~70 | Wins, with numbers, plus how it's going since (the answers I added to the notes). |
| 7 | What I'd do differently | `## What I'd do differently` | ~50 | 1–2 lessons, each tied to something in the note's "What went wrong" section. No invented regrets or plans. |
| 8 | Who it's for | `## Who it's for` | ~30 | Short, from the note's "Benefits / who it's for". |
| 9 | Close | *(none)* | ~30 | Where it stands now, the repo link and a one-line sign-off. |

Notes on the sections:

- **Hook:** open with the problem, not the app's name or a definition. Never write "In this post…".
- **The multi-agent workflow** comes up in every project. Give it 2–3 sentences per post, usually in "How it works" or "The calls we made", and focus on what was different this time. Each post must still make sense on its own.
- **What broke** uses this shape for each bug:
  `**The app crashed only on my phone.** Cause in 1–2 sentences. The fix in one. *Lesson: …*`
- **Close:** point to the repo, e.g. "The code is on GitHub: [snitch](url)". If there's no repo link, end on where the app stands instead.

## 3. Memes

The memes carry the humour, and each one has a job. The text sets up a tension, the GIF acts it out, and the caption lands the point.

- **How many:** 3–4 per post. The first one ends the hook. After that, use at most one per section, placed at the end of the section. Good spots are the hook, "The calls we made", "What broke" and "What went right".
- **Caption:** one italic line directly under the GIF, 15 words or fewer. It's a joke that also restates the section's point. For example, after the Gemini 404 story: *The model list said it was there. The API said it wasn't.*
- **Pick by story beat:**
  - the everyday pain or the status quo → calm-amid-chaos ("this is fine" style)
  - a plan or spec coming together → scheming, "it's all coming together"
  - a bug that only appears on the real device → disbelief, confusion
  - agents cut off by usage limits → exhaustion, falling asleep
  - the fix landing or tests going green → celebration
  - the finished app in daily use → someone overjoyed about a thing they love
- **Source:** well-known reaction GIFs on Tenor, linked directly (see section 4). Don't upload GIFs to the repo.
- **Don't:** use GIFs that need a block of text read, anything political, crude or punching down, or private people. Never reuse a GIF within the series.
- **Alt text is required:** who or what is on screen, and what they're doing, e.g. "A dog sitting calmly at a table while the room burns around him".

## 4. Markdown and files

Each post is two pieces:

1. `content/blogs/<slug>.md`, the body.
2. An entry in `content/projects.json`:

```json
{
  "slug": "<slug>",
  "title": "Building <App>: <the promise or twist>",
  "date": "<last_session from the note's frontmatter>",
  "description": "<one sentence, 120 characters max: the hook, not a feature list>",
  "tags": ["android", "kotlin", "ai-agents", "<one project tag>"],
  "github": "<repo URL from the note>",
  "featured": false
}
```

- Leave out `github` if the note has no repo URL. The post's "view on github →" link then disappears on its own.
- Keep the title under about 70 characters.

Rules for the body:

- **No `# H1`.** The page header already shows the title, date, tags and GitHub link from `projects.json`. Start straight with the hook.
- **Headings:** use `##` for sections. Use `###` only if a section really needs sub-parts; bold lead-ins usually do the job better.
- **Dividers:** put a `---` line after the hook and before each `##` after that.
- **GIFs:** write the GIF block as two lines of the same paragraph, with no blank line between them, so the caption sits right under the GIF:

  ```markdown
  ![A dog sitting calmly at a table while the room burns around him](https://media1.tenor.com/m/<id>/<name>.gif)
  *The caption goes here.*
  ```

  Use the direct `media1.tenor.com/…/<name>.gif` URL: open the GIF on Tenor and copy the image address. A `tenor.com/view/…` page link won't display as an image.
- **Your own images** are rare. Put them at `./assets/images/<slug>/<file>.png`, with a leading `./` and never `../`. Only use screenshots that show no personal data.
- **Code:** at most 1 block per post, 10 lines or fewer, with a language tag, and only when the code is the lesson (a bug and its fix). Use inline `code` for file, class and command names.
- **No tables:** the site doesn't style them, so use bullets.
- **Links:** the repo link, plus relative links to other posts in the series where genuinely relevant (`./project.html?slug=<slug>`). Nothing else.

## 5. Facts and privacy

- **Only facts from the project's note.** That's `10-Projects/<project>/overview.md` in my Obsidian vault, including the answers I added under "Open questions for me". Nothing from memory, the repo or the web.
- **`[?]` means unconfirmed.** Leave it out. If the story really needs it, say it as uncertain ("as far as I can tell"), never as fact.
- **Claude's claims stay Claude's.** Things the notes attribute to Claude, such as market research, are either attributed ("Claude's research said…") or skipped.
- **My own words:** my quotes in the notes can be used as first-person lines. Fix typos, but keep the meaning.
- **Numbers and dates:** copy numbers exactly. Write dates as a month and day ("on July 17"), never "last week".
- **Never include:**
  - API keys, tokens, OAuth client or project IDs, certificate fingerprints, or keystore details
  - email addresses, phone numbers, or file paths from my computer
  - private links, such as claude.ai artifact links
  - my body or health numbers (weight, calorie targets, meals), locations (the gym, my city) or my time zone
  - names of family or friends ("my parents" is fine)
  - real chat messages, chat or group names, book notes, journal entries, or sample and fixture data from the apps
  - my phone's brand or model, unless it's the cause of the bug being described

## 6. The series

| Post | Note (in `10-Projects/`) | Slug | Date | GitHub | Project tag |
|---|---|---|---|---|---|
| Snitch | `snitch/overview.md` | `snitch` | 2026-09-18 | https://github.com/chandan-satapathy/snitch | `gemini` |
| persist | `just-do-it/overview.md` | `persist` | 2026-07-18 | https://github.com/chandan-satapathy/just_do_it | `gamification` |
| Book Notes | `book-notes/overview.md` | `book-notes` | 2026-07-08 | https://github.com/chandan-satapathy/book_notes | `ocr` |
| WhatsApp Notes | `whatsapp-notes/overview.md` | `whatsapp-notes` | 2026-07-07 | none, so leave `github` out | `gmail-api` |

Watch-outs for each post:

- **Snitch:** no body, diet or calorie numbers of mine, and no link to the UI mockup.
- **persist:** the app is called persist, but the repo is still `just_do_it`. Say so once, so the GitHub link isn't confusing.
- **Book Notes:** no real book titles or journal content.
- **WhatsApp Notes:** never quote a real message, sender or chat name. Describe formats generically, e.g. `[dd/MM(/yy), HH:mm] Sender: text`. There's no repo link.

## 7. Before publishing

1. The body is 700–800 words (`wc -w`, not counting code, image lines or `---`), with no `# H1`.
2. Every claim traces back to the note, and nothing comes from a `[?]` line stated as fact.
3. Privacy check: search the draft for `@`, `/Users`, `~/`, `claude.ai`, `key` and `token`, and for any name that isn't mine or a product's.
4. There are 3–4 GIFs, each with alt text and a caption. Open every GIF URL to confirm it loads.
5. The `projects.json` entry is added, and its slug matches the file name.
6. Preview it locally: run `python3 -m http.server 8080` in the repo root, then open `http://localhost:8080/project.html?slug=<slug>`. Check that the title shows once, captions sit under their GIFs, and it reads well at phone width.
