I'm in a lot of WhatsApp groups and chats where important discussions happen, and I sometimes lose track of what's going on. I wanted organised notes by day, group and chat, somewhere I could search later, photos and documents included. And it had to be simple enough for my parents to use without much of a learning curve.

My first idea was a WhatsApp plugin. Claude's answer: consumer WhatsApp has no plugin model. So I built WhatsApp Notes, an Android app that captures what you pick from WhatsApp and emails it to you as tidy notes.

![Charlie Day in front of a wall of papers and red string, pointing frantically](https://media1.tenor.com/m/4LvAD8hD5tcAAAAC/charlie-day.gif)
*Me, scrolling back through a group chat for "that one message".*

---

## What it does

- **Copy, then capture:** copy messages in WhatsApp, open the app, and it reads each line's sender and time.
- **Share photos and files:** each one you share joins the same open note.
- **Email in the background:** each note gets an automatic title and chat-name chips, then goes out through Gmail.
- **Retry:** a history screen shows what was sent or failed.

Importing a whole exported chat is written, but not committed yet.

---

## How it works

It's Kotlin and Jetpack Compose with Room and WorkManager, and deliberately lean: no Hilt, no Retrofit, no Google API client and no backend.

- **Reading the clipboard.** Android only allows clipboard reads while an app is focused, so the app reads it as soon as it gets focus. A table-driven parser turns `[dd/MM(/yy), HH:mm] Sender: text` lines into messages and works out the missing year.
- **Sending.** Notes go out through a `Destination` interface, email today and Google Sheets later, as a hand-built MIME message posted straight to Gmail's API. Each note gets one unique background job, so a retry never sends a duplicate.

Claude wrote the plan, Sonnet agents built the parsing, an Opus agent built Gmail sign-in and sending, and Claude reviewed and re-ran the tests before each commit.

---

## The calls we made

**Send as yourself.** After my first test email, I asked why the app didn't use its own email account. Claude's answer: an app password baked into the app would unlock that whole mailbox, while signing in with your own Google account needs no shared secret and no server. I put the idea on the back burner.

**Spike first, then copy instead of share.** Claude first built a tiny test app that dumped whatever WhatsApp sent it. About ten minutes in, I hit the wall: WhatsApp only shares a single photo or video with outside apps. Text, or several messages at once, can't be shared out at all.

The fix beat the plan. Copying several messages puts each line on the clipboard with its sender and time, which the share sheet never gave us. Claude ruled out the alternatives, from an overlay (it can't read the screen under it) to unofficial bots (account-ban risk).

![A man in a leather jacket tapping his temple with a knowing grin](https://media1.tenor.com/m/vtgvGh5EuaQAAAAC/roll-safe-clever.gif)
*Can't be blocked by the share sheet if your text never goes near it.*

---

## What broke (and how we fixed it)

**The buttons were invisible.** On Android 15, apps targeting SDK 35 are forced edge-to-edge, and the test app's views were drawn under the top bar. The test app dropped to SDK 34; the real app handles insets properly. *Lesson: plan for edge-to-edge from the first screen.*

**A function that quietly wasn't ours.** We wrote a `LocalDate.toEpochDay()` extension, but the JDK already has a method with that exact name, and a class's own method always wins over an extension. The result was a confusing type mismatch, fixed by renaming ours to `asEpochDay`. *Lesson: never give an extension the same name as a real method.*

![Two Spider-Men pointing at each other in front of a police van](https://media1.tenor.com/m/QXVs4QWLlzkAAAAC/spider-man.gif)
*Our toEpochDay() and the JDK's toEpochDay(). Guess which one got called.*

---

## What went right

Milestones M0 to M2 took about 12 hours of wall-clock time, including an overnight pause for the session limit: 8 commits and 20 passing tests. My verdict after the first real send: "the email test went fine." The design was built for my parents from the start, with big touch targets, large text, plain-language errors, and undo instead of "are you sure?" dialogs.

---

## What I'd do differently

- **Capture a real exported chat during the spike.** The test app never saw one, so the import parser was written against an assumed format.
- **Commit before the session ends.** The chat import was written in the last session, but never committed.

---

## Who it's for

Me: a dated, searchable archive of important threads, right in my inbox. And my parents: capture, check, tap Send. It all runs on the phone, with no backend and no risk to your WhatsApp account.

---

Right now, copying, sharing and emailing work on my phone. The chat import is waiting for a commit, and QR setup for my parents is planned next.
