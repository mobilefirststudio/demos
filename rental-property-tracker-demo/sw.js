// Bump CACHE_NAME (e.g. to -v3) whenever you redeploy index.html.
const CACHE_NAME = 'rental-property-tracker-demo-v2';
const PDF_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
const ASSETS = [
  './',
  './index.html',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  PDF_LIB_URL
];

self.addEventListener('install', (event) => {
  // Each file is saved on its own, so one missing file can't stop the rest from being saved.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try to fetch the latest version when online.
// Only fall back to the cached copy if the network request fails (offline).
// Only this app's own files and the PDF tool (for printable pages offline) are cached.
// Google Drive and other outside requests pass straight through.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const isPdfLib = event.request.url === PDF_LIB_URL;
  if (new URL(event.request.url).origin !== self.location.origin && !isPdfLib) return;
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && (response.status === 200 || (isPdfLib && response.type === 'opaque'))) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return response;
    }).catch(() =>
      caches.match(event.request).then((cached) =>
        cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())
      )
    )
  );
});
