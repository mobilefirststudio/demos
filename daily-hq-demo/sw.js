// Service worker for Daily HQ (Free Demo)
// Bump CACHE_NAME whenever you redeploy index.html so returning
// visitors pick up the new version instead of a stale cache.
const CACHE_NAME = 'daily-hq-demo-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Network-first for the app shell (so edits show up quickly when online),
// falling back to cache when offline. Cross-origin requests (fonts, icon
// font CDN) always go straight to the network — never intercepted or cached.
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request).then(function(res) {
      var copy = res.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
      return res;
    }).catch(function() {
      return caches.match(event.request).then(function(cached) {
        return cached || caches.match('./index.html');
      });
    })
  );
});
