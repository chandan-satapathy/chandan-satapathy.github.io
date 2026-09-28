I wanted two numbers at the end of every day: what I ate and what I burned.

The burned side had to count everything, from what my body burns just by existing to the gym, a flight of stairs or a walk. The eaten side had to understand what's actually on my plate, which is mostly home-cooked Indian food and whatever snacks are around. And logging had to be lazy. Type a sentence or snap a photo, and let the app do the maths.

So I built Snitch. The name is the whole idea: the app's job is to get me to snitch on my own daily intake and outtake, so I can get in shape. You type "2 roti and 1 cup dal" or "walked 3 km", and it does the rest.

It was also an experiment in splitting the work between models. Opus planned and reviewed. Sonnet wrote most of the code.

![Randall from Recess scribbling in his notebook, ready to tell on someone](https://media1.tenor.com/m/0vTdyPotz68AAAAC/randall-recess.gif)
*Every roti goes on the record.*

---

## What it does

- **Log in plain English:** type what you ate or did, and Gemini turns it into entries.
- **Log by photo:** take a picture with your camera app or pick one from your gallery.
- **Scan a barcode:** packaged snacks come from Open Food Facts.
- **Search Indian foods:** 542 foods from the IFCT 2017 food table ship inside the app. Or skip the AI and type the numbers in yourself.
- **Count what you burn:** log activities yourself, and Snitch adds active calories from Health Connect.
- **See the balance:** an animated energy ring, macro bars, weekly totals, a month calendar and a weight trend.
- **Get nagged, politely:** meal reminders that only fire if you haven't logged that meal yet, plus a 9 PM summary.

---

## How it works

It's a native Android app: Kotlin, Jetpack Compose with Material 3, Hilt, Room and WorkManager. It's one Gradle module split into packages, and the `domain/` layer has no Android dependencies at all.

The interesting part is the food pipeline:

```text
"2 roti and 1 cup dal"  (or a photo)
  → Gemini: return structured JSON (one retry if it's malformed)
  → Reconciler: fuzzy-match each dish against IFCT 2017
      match score ≥ 0.82 → use the database's macros, scaled to the grams
  → saved to Room → Home shows "Added: …"
```

The rule is simple: the LLM guesses, the database decides. For Indian foods the table knows, its numbers win, and the model's estimate is only the fallback. Activities work the same way, against a local table of MET values (a standard measure of how much energy an activity burns). Photos take the same path after being shrunk to at most 1,024 pixels.

The energy maths avoids one classic trap. "Burned" is your logged activities plus Health Connect's *active* calories only. Your resting burn is already part of your daily target, so adding total calories would count it twice.

The build ran the same loop for every phase. Opus wrote a spec, a Sonnet subagent implemented it, and Opus read the diff and re-ran the build and tests before anything moved on. Claude installed checkpoints on the emulator, and I tested them by hand and sent back screenshots. Whenever the conversation got too long, Claude wrote a `HANDOFF.md` and I started a fresh session from it. That happened three times.

![A cartoon frog peering very seriously through a magnifying glass](https://media1.tenor.com/m/zu5aeuv5vXsAAAAC/worry-froge-froge.gif)
*Opus, reading every Sonnet diff before it lands.*

---

## The calls we made

**Gemini instead of hosting my own model.** My first idea was to take one of the free models on Hugging Face and host it somewhere. Claude pushed back. Self-hosting means paying for GPUs and waiting on cold starts, and open food classifiers are weak on Indian food. So Snitch calls Gemini's free tier, which has mostly been enough so far.

**A chat box instead of forms.** Home is a single chat-style composer. Early on, it also showed entries and confirmation cards. I asked for something closer to the Claude app: a thinking message, then just "entry added" or the error, with no bubble or card, to keep the UI clean. Now entries save automatically, and you fix them in the Diary.

**The system camera instead of building one.** Claude suggested handing photos off to the phone's own camera app and the Photo Picker instead of building a camera with CameraX. That meant no camera permission and no new dependencies, at the cost of briefly leaving the app. (I asked if skipping the permission was a workaround. It isn't; it's the standard pattern.) Barcode scanning works the same way through Google's Code Scanner, where Play Services owns the camera.

**Local-first, bring your own key.** All data lives on the phone. Each user pastes their own Gemini key, which is encrypted with a key held in the Android Keystore. I once offered to share my key in the chat. Claude declined and had me enter it only inside the app.

![Leonardo DiCaprio in a tuxedo raising a glass, captioned "No, thank you!!!"](https://media1.tenor.com/m/CQn5ZnzTJdAAAAAd/leonardo-dicaprio.gif)
*I offered Claude my API key. Claude handed it right back.*

---

## What broke (and how we fixed it)

**The app crashed on launch, but only on my phone.** My phone's first run died at startup with an `AEADBadTagException` from `EncryptedSharedPreferences`. The phone's Keystore could no longer decrypt a leftover or restored encrypted keyset. The store now wipes and rebuilds itself when that happens, and app backup is switched off. *Lesson: an encrypted store needs a plan for the day its key goes missing, and the emulator won't show you that day.*

**Saving a barcode scan crashed the app.** The database threw a `FOREIGN KEY constraint` failure. The barcode was being stored as `foodId`, which has to point at a row in the IFCT foods table. That was Claude's own spec error, and the unit test had been written to expect the wrong value, so it passed. The fix was `foodId = null` for barcode items, with the test flipped to guard against it. *Lesson: a test written from a wrong spec just agrees with the bug.*

**Every AI call returned HTTP 404.** Claude worked through theory after theory: the model not being available for my key, an encoded `:` in the URL, a doubled `models/` prefix, the key format. None of them was it. Then Claude asked me to run a `curl` against the API and paste the error body, and that settled it in minutes. `gemini-2.5-flash` was "no longer available to new users", even though the model list still showed it. The fix had three parts:
- switch to the `gemini-flash-latest` alias
- add a model picker that chooses at runtime, with fallbacks and one retry after a 404
- show Google's own error message in the app

*Lesson: read the real error body before theorising, and don't hard-code a model ID that can be retired.*

![John Travolta as Vincent Vega looking around an empty room, confused](https://media1.tenor.com/m/_BiwWBWhYucAAAAd/what-huh.gif)
*The model list said it was there. The API said it wasn't.*

---

## What went right

- **Speed.** The whole planned roadmap (Phases 0–8) plus a seven-step UI revamp took 7 active days across 4 sessions, between September 6 and 18. The build, the tests and detekt stayed green at every checkpoint, and the test count went from 14 to 200.
- **Reviews worked both ways.** Opus caught a wrong detekt count in a subagent's report, and a photo compressor that only downsampled in powers of two, which didn't match its own docs. Subagents caught bugs in Opus's specs too.
- **Good seams paid off.** Photo logging reused the entire text pipeline, because the slot for image data had been reserved from the start.
- **I actually use it.** I've logged every day since mid-September, mostly by text and barcode, then quick entry. When I've compared its numbers with other apps, it's generally within 5%.

![Young Anakin Skywalker celebrating: "It's working! It's working!"](https://media1.tenor.com/m/FaENh2t8h8cAAAAC/its-working-star-wars.gif)
*My exact words on September 8: "it is working amazingly."*

---

## What I'd do differently

- **Test on the real phone from day one.** The launch crash, the hard-to-read onboarding screen and the barcode crash all showed up on my phone, not the emulator. My first run on it was on day four.
- **Write real database migrations from the start.** On September 9 a schema change wiped all my data, because the database was set to reset itself (`fallbackToDestructiveMigration`). Real, tested migrations only arrived the next day.
- **Set up git on day one.** As late as September 18, the handoff doc still said "git NOT initialized", and the repo's history is one squashed commit. This post was pieced together from chat logs.

---

## Who it's for

Mostly me: someone who eats mostly home-cooked Indian food and wants logging food and activity to be easy, with a nudge when I forget. It might suit you too, if you want AI photo logging without a subscription. The catch is that you need your own Gemini key. There's no Snitch server, no camera permission, and health data is only read while the app is open.

And if you're curious how an "Opus plans, Sonnet builds" setup holds up on a real app, the repo is a full worked example.

---

Snitch is on my phone and snitches on me every day. The code is on GitHub: [snitch](https://github.com/chandan-satapathy/snitch). Now if you'll excuse me, I have a roti to report.
