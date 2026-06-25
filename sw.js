const CACHE_NAME = "englishflow-v27";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=20",
  "./app.js?v=26",
  "./config.js?v=20",
  "./manifest.json",
  "./data/words.json",
  "./data/phrases.json",
  "./data/dialogues.json",
  "./data/quizzes.json",
  "./data/sentences.json",
  "./data/pairs.json",
  "./data/blanks.json",
  "./icons/icon.svg",
  "./icons/englishflow-logo.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./favicon.ico?v=22",
  "./icons/apple-touch-icon.png?v=21",
  "./icons/favicon-32.png?v=22",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
