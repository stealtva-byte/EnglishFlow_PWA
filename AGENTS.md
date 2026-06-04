# EnglishFlow PWA Agent Guide

## Project Goal

Build EnglishFlow as a personal PWA for learning English from A0 to A2. The app should work as a static frontend first, then use OpenAI API through a server-side proxy for pronunciation feedback and dialogues.

## Current Stack

- Use plain HTML, CSS, and JavaScript.
- Do not add frameworks or npm tooling unless the user explicitly approves a later migration.
- Keep the app installable as a PWA with `manifest.json` and `sw.js`.
- Store user progress in `localStorage`.
- Keep static lesson data in JSON files under `data/`.

## Security Rules

- Never put an OpenAI API key in `index.html`, `app.js`, `config.js`, JSON data, or any other public frontend file.
- `config.js` may contain only public settings, such as a proxy endpoint URL.
- OpenAI calls must go through a server-side proxy such as Cloudflare Worker, Netlify Function, Vercel Function, or VPS-hosted endpoint.

## Product Decisions

- User progress is local-only for now. Each installed browser/PWA keeps its own `localStorage` progress without registration.
- Future account sync should be additive and must not break existing local progress. A later backend can import or sync local progress, but Phase 1 must work without login.
- Main pronunciation feedback model: `gpt-5-mini`.
- Main dialogue model: `gpt-5-mini`.
- Optional higher-quality tutor mode: `gpt-5`.
- Optional OpenAI speech recognition fallback: `gpt-4o-mini-transcribe`.
- Optional OpenAI TTS fallback: `gpt-4o-mini-tts`.
- Browser Web Speech API remains the free default for speech input/output where supported.

## Design Direction

- Reference: https://neuform.ai/community/featured
- Do not copy Neuform literally. Adapt its polished product feel, side navigation, cards, badges, and dense visual structure.
- EnglishFlow should feel calmer, clearer, and more useful for daily study than a design-template gallery.
- Prefer a light learning console first, with a later optional dark mode inspired by Neuform.

## Development Workflow

- Read `PLANS.md` before creating or updating an ExecPlan.
- Keep `EnglishFlow_ExecPlan.md` up to date while building.
- Prefer small, observable milestones.
- After frontend work, run a local static server and verify the app in a browser.
- Do not revert user changes unless explicitly asked.
