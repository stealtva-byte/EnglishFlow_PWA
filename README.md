# EnglishFlow PWA

EnglishFlow is a personal Progressive Web App for learning practical English from A0 to A2. It runs as a static site with plain HTML, CSS, and JavaScript.

## What Works Now

- Word cards with English word, transcription, Russian translation, and visual association.
- Browser text-to-speech with saved male/female voice preference.
- Local progress without registration.
- XP, streak, daily goal, weak words, and seven-day progress view.
- Four games:
  - Guess the translation.
  - Build the sentence.
  - Fill the blank.
  - Tap pairs.
- PWA manifest and service worker for installability and offline caching.

## Local Run

From this folder:

    python3 -m http.server 4173

Open:

    http://localhost:4173

## User Progress

Progress is stored locally in each user's browser or installed PWA. No registration is required. If several people install the app on their own devices, each person gets separate progress.

Future account sync can be added later without changing the current local-first behavior.

## OpenAI API

OpenAI is planned for pronunciation feedback and dialogues, but API calls are not enabled in this static MVP yet.

Never put an OpenAI API key in frontend files. When AI features are added, the PWA must call a server-side proxy such as Cloudflare Worker, Netlify Function, Vercel Function, or a VPS endpoint.

## Deployment

This app can be hosted as static files on GitHub Pages, Cloudflare Pages, Netlify, Vercel, or a VPS. See `DEPLOYMENT.md`.

