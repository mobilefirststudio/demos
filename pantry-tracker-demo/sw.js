// Pantry Tracker (Free Trial) — Service Worker
// Bump CACHE_NAME (e.g. to -v3) whenever you redeploy index.html.
const CACHE_NAME = "mfs-pantrytracker-demo-v2";
const PDF_LIB_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  PDF_LIB_URL
];

self.addEventListener("install", (event) => {
  // Each file is saved on its own, so one missing file can't stop the rest from being saved.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(CORE_ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Network-first for the page itself; cache-first for other same-origin
// static assets and the PDF tool (so printable pages work offline too).
// Everything else cross-origin (Google Fonts, Google Drive, Google
// Identity Services) is left alone so backup/sync always hits the real network.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isPdfLib = event.request.url === PDF_LIB_URL;
  if (url.origin !== self.location.origin && !isPdfLib) return;

  const isPageRequest =
    event.request.mode === "navigate" ||
    url.pathname.endsWith("/index.html") ||
    (url.origin === self.location.origin && url.pathname.endsWith("/"));

  if (isPageRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => Response.error())
      );
    })
  );
});
