# Build EnglishFlow PWA Phase 1

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This repository contains `PLANS.md`, and this document must be maintained according to its requirements.

## Purpose / Big Picture

EnglishFlow should become an installable web app for one learner who studies English for 15 to 30 minutes per day. After Phase 1, the user can open the app, navigate between the main sections, study word cards, hear English pronunciation through the browser, mark whether they knew a word, and keep progress locally. The app should run locally for review now and later be deployable to static hosting so it works from a phone without the MacBook staying open.

## Progress

- [x] (2026-06-04 12:21Z) Read `TZ_EnglishFlow_PWA.md` and `PLANS.md`.
- [x] (2026-06-04 12:21Z) Updated the technical specification to use OpenAI API instead of Claude API and to require a server-side proxy for secrets.
- [x] (2026-06-04 12:21Z) Added `AGENTS.md` with project rules, security decisions, and design direction.
- [x] (2026-06-04 12:21Z) Create the static PWA file structure.
- [x] (2026-06-04 12:21Z) Implement the Phase 1 card-learning experience.
- [x] (2026-06-04 12:21Z) Add the first 100 words in `data/words.json`.
- [x] (2026-06-04 12:21Z) Run a local server and verify the app in a browser.
- [x] (2026-06-04 12:21Z) Add local voice selection settings for browser speech synthesis.
- [x] (2026-06-04 12:21Z) Remove Auto voice mode and filter voice dropdown by male/female preference where browser voice names allow it.
- [x] (2026-06-04 12:21Z) Add the first working game, "Guess the translation", with Minecraft, car, travel, and base vocabulary.
- [x] (2026-06-04 12:21Z) Add sentence-building data and a working "Build the sentence" game.
- [x] (2026-06-04 12:21Z) Add fill-in-the-blank data and a working "Fill the blank" game.
- [x] (2026-06-04 12:21Z) Add picture/word matching data and a working tap-pairs game.

## Surprises & Discoveries

- Observation: The repository initially contained only the technical specification and the execution-plan rules, so the app is being built from scratch.
  Evidence: `rg --files` returned `TZ_EnglishFlow_PWA.md` and `PLANS.md` before implementation began.

- Observation: The workspace is not yet a Git repository.
  Evidence: `git status --short` returned `fatal: not a git repository (or any of the parent directories): .git`.

- Observation: A cache-first service worker made CSS updates hard to see during local testing.
  Evidence: the mobile viewport initially kept the older one-column stats layout after CSS had changed. The service worker was changed to network-first with cache fallback and the asset version was bumped.

- Observation: The local browser exposed many English browser voices but did not provide an explicit gender field.
  Evidence: browser verification found 47 English voices, and the app inferred likely male/female matches from voice names such as Fred and Samantha.

- Observation: Voice filtering can only be as accurate as browser voice names.
  Evidence: the local browser did not expose a gender property, but after filtering, the male list contained Fred and the female list contained Samantha.

- Observation: Wordwall-style matching is useful as a mechanic reference for children, but the project should use its own vocabulary and layout.
  Evidence: the referenced Wordwall page is a body-parts activity; EnglishFlow now implements its own tap-pairs activity with body, Minecraft, car, travel, and food items.

## Decision Log

- Decision: Use OpenAI API instead of Claude API for future AI feedback and dialogues.
  Rationale: The user asked to adapt the Claude-authored specification to OpenAI, and OpenAI gives a clean path for text feedback, dialogue, transcription, and speech generation.
  Date/Author: 2026-06-04 / Codex

- Decision: Use `gpt-5-mini` for pronunciation feedback and dialogues, with `gpt-5` reserved as an optional higher-quality tutor mode.
  Rationale: The user preferred quality over the cheapest option, while still keeping the app affordable for personal daily use.
  Date/Author: 2026-06-04 / Codex

- Decision: Keep API keys out of the frontend and require a server-side proxy.
  Rationale: A GitHub Pages PWA is public static code; any key shipped in frontend files can be copied by anyone who opens the app.
  Date/Author: 2026-06-04 / Codex

- Decision: Start with a Neuform-inspired but calmer light learning console design.
  Rationale: Neuform is a good reference for polished cards and navigation, but a daily learning app needs clearer hierarchy and less visual strain.
  Date/Author: 2026-06-04 / Codex

- Decision: Use a network-first service worker strategy for fetched assets.
  Rationale: This keeps offline fallback while allowing future deployed updates to reach the user faster than a strict cache-first strategy.
  Date/Author: 2026-06-04 / Codex

- Decision: Keep progress local-only without registration for the first usable version.
  Rationale: The user wants to share the app with family and a small group, and each person's browser/PWA can safely keep separate local progress. Account sync can be added later without blocking the current product.
  Date/Author: 2026-06-04 / Codex

- Decision: Add user-selectable browser voices before OpenAI TTS.
  Rationale: Browser voices are free and already differ by device; letting each person choose a pleasant available voice solves the immediate quality issue without adding API cost.
  Date/Author: 2026-06-04 / Codex

- Decision: Remove the Auto voice mode.
  Rationale: The user preferred a simpler choice between male and female voices, and Auto added ambiguity without much value.
  Date/Author: 2026-06-04 / Codex

- Decision: Add Minecraft, car, and travel vocabulary to the first game.
  Rationale: The user requested motivating themes for his son while keeping travel practice for the original EnglishFlow goal.
  Date/Author: 2026-06-04 / Codex

- Decision: Implement tap-pairs with taps rather than line drawing or drag-and-drop.
  Rationale: Tap-pairs are more reliable on phones and easier for children than precise line drawing in a mobile PWA.
  Date/Author: 2026-06-04 / Codex

- Decision: Keep sentence-building grammar simple for now.
  Rationale: A0-A2 learners benefit from word order patterns such as "I want...", "Where is...?", "Can I have...?", and "Do you have...?" before formal tense explanations.
  Date/Author: 2026-06-04 / Codex

- Decision: Complete the fourth game as fill-in-the-blank before moving to deployment.
  Rationale: The Games section had a visible placeholder for this mode, and completing it makes the first playable learning loop feel whole.
  Date/Author: 2026-06-04 / Codex

## Outcomes & Retrospective

Phase 1 is implemented and browser-verified locally. The app has a static PWA shell, Neuform-inspired learning-console styling, 100 starter words, browser speech synthesis, card review actions, local progress persistence, placeholder sections for dialogues, a progress dashboard, saved voice selection, and four working games: "Guess the translation", "Build the sentence", "Fill the blank", and "Tap pairs". Desktop and mobile viewport checks passed with no console warnings or errors reported by the browser tool.

## Context and Orientation

The repository root is `/Users/vyacheslavtyulenev/Documents/Codex/EnglishFlow_PWA`. The project is intentionally simple: there is no build step, no framework, and no package manager. The browser will load `index.html`, `style.css`, `app.js`, and JSON data files directly from a static server.

A PWA, or Progressive Web App, is a website that can be installed on a phone or desktop and can cache files for offline use. In this repo, `manifest.json` will describe the installable app, and `sw.js` will cache static files. `localStorage` is the browser's small local key-value database; EnglishFlow uses it for progress, XP, streaks, and card review history.

OpenAI API work is not part of Phase 1. When it is added, the frontend must call a proxy URL, not OpenAI directly with a secret key.

## Plan of Work

First create the static application files: `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`, `config.js`, `data/words.json`, `data/phrases.json`, `data/dialogues.json`, and icon assets. The initial app should show four sections: Cards, Games, Dialogues, and Progress.

Then implement the Cards section as the main working feature. The card should show an English word, transcription, Russian translation, theme, and a simple visual association. It should speak the word using `SpeechSynthesis` with an English voice where available. The user should be able to reveal the translation, mark "knew" or "did not know", and move to the next word. Progress should be stored in `localStorage` immediately.

The Games and Dialogues sections can be useful placeholders in Phase 1, but they should already look like part of the product. The Progress section should display learned words, weak words, XP, current streak, daily goal, and a seven-day activity view using saved local data.

Finally run the app through a local static server, open it in the browser, and verify that the first learning loop works.

## Concrete Steps

Work from `/Users/vyacheslavtyulenev/Documents/Codex/EnglishFlow_PWA`.

Create or update the files with direct edits. Start the local server with:

    python3 -m http.server 4173

Then open:

    http://localhost:4173

Expected result: the EnglishFlow interface appears, the Cards tab is active, clicking the sound button speaks the English word if the browser supports speech synthesis, and clicking the self-rating buttons updates progress.

## Validation and Acceptance

Phase 1 is accepted when a human can perform this scenario:

Open `http://localhost:4173`, see the EnglishFlow interface, use the navigation to switch between Cards, Games, Dialogues, and Progress, return to Cards, reveal a translation, hear or attempt to hear pronunciation, mark the card as known or unknown, reload the page, and see the progress preserved.

The PWA acceptance is that `manifest.json` is linked from `index.html`, `sw.js` is registered, and the browser console does not show fatal errors during normal use.

## Idempotence and Recovery

The implementation is additive. Re-running the local server is safe. If local progress becomes confusing during testing, clear the browser's local storage for the localhost origin and reload. Do not delete source files to reset user progress.

## Artifacts and Notes

Key files after Phase 1 should include:

    index.html
    style.css
    app.js
    manifest.json
    sw.js
    config.js
    data/words.json
    data/phrases.json
    data/dialogues.json
    icons/icon.svg

## Interfaces and Dependencies

The app depends only on browser APIs: DOM APIs for rendering, `fetch` for loading JSON, `localStorage` for progress, `SpeechSynthesis` for text-to-speech, and Service Worker APIs for offline caching.

The future OpenAI proxy interface should expose public HTTPS endpoints such as `/api/pronunciation-feedback` and `/api/dialogue`. The exact proxy implementation will be planned in a later milestone.

## Revision Notes

2026-06-04: Created the initial ExecPlan after reading `PLANS.md`, adapting the project to OpenAI API, and confirming the Neuform-inspired design direction.

2026-06-04: Added the Phase 1 PWA source files and starter data. Browser verification remains the next step.

2026-06-04: Verified Phase 1 locally at `http://localhost:4173`. The card loop updates XP and daily progress, progress survives reload, the Progress section reflects saved data, and mobile layout uses compact stats plus bottom navigation.

2026-06-04: Recorded the product decision to keep progress local without login for now and add voice selection as the next improvement.

2026-06-04: Implemented voice selection. The Cards screen now has Auto/Male/Female preference buttons, a concrete device voice dropdown, a voice test button, and persisted voice settings.

2026-06-04: Removed Auto voice selection, filtered voice lists by selected male/female preference where possible, and added a working "Guess the translation" game with Minecraft, cars, travel, and base vocabulary.

2026-06-04: Added "Build the sentence" with simple statements and questions, plus "Tap pairs" with image/association-to-word matching inspired by school-style Wordwall exercises.

2026-06-04: Added "Fill the blank" with 20 short phrase prompts across base, cafe, travel, car, Minecraft, body, and politeness themes. Verified correct and incorrect answer feedback in the browser.
