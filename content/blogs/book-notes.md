I wanted one place for my reading: the books I've read, the ones I'm reading and the ones I'm going to read. I also wanted it to be a diary of sorts. When a line on a page hits, I wanted to photograph it, highlight the quote and keep it tagged to the book. And I wanted to find any of it again by book, quote or keyword.

So I built Book Notes: a minimal Android reading tracker and journal, with dark and light modes, that keeps everything on my phone.

![Kowalski from Penguins of Madagascar writing in a notebook, captioned "Noted."](https://media1.tenor.com/m/YFCU777uig0AAAAC/kowalski-noted.gif)
*Every good line, noted. Photo of the page included.*

---

## What it does

- **Three shelves:** Reading, Library and Want to Read.
- **A journal per book:** notes with page, chapter, tags and images.
- **Quotes from a photo:** snap the page, then tap or drag to pick the lines you want.
- **Voice notes:** record a thought and get an on-device transcript you can edit.
- **Search everything:** books, notes, quotes and voice notes, with filters.

Covers and descriptions come from Google Books, and everything backs up to a zip.

---

## How it works

It's Kotlin, Jetpack Compose, Hilt, and Room with full-text search tables. Three pieces stand out:

- **The quote picker.** ML Kit reads the page on the device and returns a box around each line. A small, pure geometry class maps those boxes onto the image on screen, so you can tap a line. Being pure, it's unit-tested for wide, tall and exact-fit images.
- **Voice notes.** The plan noted that Android's speech recognizer only works on live speech, so the app records and transcribes at once, stitching the pieces together after each pause. If the mic is busy, it records audio only.
- **Sync-ready data.** Every row has a UUID, timestamps and a soft-delete marker, so cloud sync can be added later.

---

## The calls we made

**A plan first, then hand it out.** My first instruction was "I want you to create a plan only." Once `PLAN.md` was done, I asked Claude to hand out tasks to Sonnet and Opus while verifying their work. Sonnet got the screen and database phases. Opus got the two hard ones: the OCR overlay and running audio and recognition at once.

**Backup in v1.** Claude made zip backup and restore a v1 requirement, because "with no cloud, your phone is the only copy of your journal". Stats, goals, widgets and sync waited for v2.

**Google Books instead of Goodreads.** I asked for Goodreads or a similar API. Claude said the Goodreads API had been shut down in 2020 and offered Google Books or Open Library. We went with Google Books, for, in Claude's words, "better covers and descriptions anyway".

![A soldier with an eye patch saluting over the caption "Press F to Pay Respects"](https://media1.tenor.com/m/2BNR29p1K_gAAAAC/press-f-to-pay-respect-press-f.gif)
*Pour one out for the Goodreads API.*

---

## What broke (and how we fixed it)

**The camera had no shutter button.** On my first device test, the edge-to-edge layout drew the bottom navigation bar over the camera controls. Now the bars hide on camera screens. *Lesson: JVM tests can't see window insets.*

**Google Books said HTTP 429.** Keyless requests share Google's anonymous quota. I created a free key, and Claude checked that the build picked it up. *Lesson: "works without a key" isn't the same as "works for you".*

**"How do I add a voice note?"** I asked this about my own app. The button sat below the fold. Three minutes later, the composer was three icons: camera, pen and mic.

**Session limits, five times.** Each time, I typed "can you continue from where you left off", and Claude checked the repo and resumed the same agent with a list of what was missing.

![A terminal starting a production build, then a title card reading "One eternity later"](https://media1.tenor.com/m/N7OzpeTuqnAAAAAC/react-computer.gif)
*Plan to final commit: about 41 hours, mostly waiting for limits to reset.*

---

## What went right

The git history matches the plan's eight phases one to one, and tests grew from 22 to 132 with no failures reported at any commit. Claude's own checks caught what the subagents missed, including a real bug where deleting a voice note could leave its audio file behind. And feedback from my phone turned around fast: six UI fixes went from my report to a rebuilt app in about 15 minutes.

---

## What I'd do differently

Get it on a real phone sooner. At the Phase 7 sign-off, OCR accuracy, live speech, real API searches and the dark and light themes had only been tested with fakes, because there was no emulator.

---

## Who it's for

Me: one private place for my shelves and reading journal that works offline, with no account and no server. And anyone who photographs pages or collects quotes and wants them searchable next to their notes.

---

The code is on GitHub: [book_notes](https://github.com/chandan-satapathy/book_notes). Now, back to the actual reading.
