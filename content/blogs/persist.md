I didn't want another to-do list.

I wanted a few non-negotiables every day, like going to the gym or learning a concept, and I wanted to feel like I'd achieved something when I kept them. Not ticks on a checklist, but a streak to show for it. And every 4–5 hours, I wanted my phone to be sarcastic enough to get me out of my slumber.

So I built persist: a fully local Android app that turns my daily non-negotiables into a hardcore streak game. It looks the part too: a terminal-style UI with `~/today ❯` headers.

![Shia LaBeouf yelling motivationally in front of a green screen](https://media1.tenor.com/m/snOO3L72DCEAAAAd/shia-labeouf-just-do-it.gif)
*Roughly the tone of my notifications, every 4–5 hours.*

---

## What it does

- **Your own non-negotiables:** onboarding is a terminal wizard where you type each one in.
- **Hardcore streaks:** one miss and it's back to 0, with no freezes. A day ends at 3 AM, not midnight, so late nights still count.
- **Roasts:** sarcastic notifications drawn from 189 lines in three tones: mild, sarcastic and unhinged. After 10 PM, if a 30+ day streak is at risk, panic mode fires every 45 minutes.
- **A graveyard:** dead streaks get a headstone and a post-mortem.
- **Gym auto-logging:** a geofence ticks off the gym once you've been there about 25 minutes.

---

## How it works

It's Kotlin and Jetpack Compose, with Room, DataStore, WorkManager and a Glance widget. The manifest has no `INTERNET` permission and app backup is off, so "fully local" is enforced, not just promised.

Two ideas hold it together. Completions are the only source of truth: streaks are never stored, only recomputed. And each activity can be completed once per day, so a tap, a geofence and a timer can all fire twice without double-logging.

The build followed a 1,192-line spec split into milestones M0 to M4. A lead model reviewed, Opus and Sonnet subagents wrote the code, and a `HANDOFF.md` carried context between sessions.

---

## The calls we made

**A geofence instead of an API.** I wanted my gym streak pulled from the app I use at the gym, but Claude found no public API. So persist geofences the gym instead, with a manual tap as a fallback. It's worked amazingly at the real gym; I just keep my GPS on.

**Guardrails before any code.** First, I asked for coding principles, then "what other guardrails can be added? theme? naming etc?" That became 16 rules in the spec, including a naming table, colours only through theme tokens (enforced by a test) and "doc and code never disagree".

**A lead that never writes code.** I asked the lead to hand tasks to Opus or Sonnet and keep reviewing. When it drifted into writing the geofence code itself, I tightened it: "your only task should be reviewing and ensuring everything is done well and according to plan." The handoff doc gained a new rule: the lead never implements.

![A King of the Hill character announcing "I'm supervising!"](https://media1.tenor.com/m/ts6fjNAkySYAAAAC/supervising-im-supervising.gif)
*The lead model's entire job description, from July 15 on.*

---

## What broke (and how we fixed it)

**The roast alarm crashed the app on my phone.** A regex in the roast code was fine on the JVM, where the tests run, but Android's ICU regex engine rejects a bare closing brace:

```text
\{([^{}]+)}    fine on the JVM, crashes on Android
\{([^{}]+)\}   escaped, fine on both
```

*Lesson: your unit tests don't run Android's regex engine.*

**The geofence wouldn't arm.** Saving showed a warning even with every permission granted. My logcat had the answer: `PendingIntent must be mutable`. The app-wide `FLAG_IMMUTABLE` pattern had been copied into the geofence code. The fix was `FLAG_MUTABLE` on API 31+. *Lesson: a pattern that's right everywhere else can be wrong in exactly one place.*

![Pikachu staring, mouth open in shock](https://media1.tenor.com/m/UZJd1pjj4NMAAAAC/surprised-pikachu.gif)
*225 green tests. One phone that disagreed.*

---

## What went right

All five milestones were code-complete in about 11 days, and tests grew from 75 to 280. Reviews caught real bugs before they shipped, like a theme toggle that would have done nothing because `MainActivity` never read the setting. And I still use it. My longest streak is 20 days of gym, piano and reading, and the roasts feel like a friend taunting me for not getting things done.

---

## What I'd do differently

- **Hunt for contradictions in the spec.** On day one the streak showed 0: one rule said a new item isn't required on its first day, but the M0 acceptance test expected a streak of 1.
- **Keep the lead out of the code from day one.** That rule came after the drift, not before.

---

## Who it's for

Me: one person, a few non-negotiables, no accounts and no server. Maybe you, if you'd rather have a streak with consequences than another to-do list. Nothing leaves the phone except a JSON export you make yourself.

---

The code is on GitHub under the app's original name: [just_do_it](https://github.com/chandan-satapathy/just_do_it). Now excuse me, my phone has opinions about my reading.
