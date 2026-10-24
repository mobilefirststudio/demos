// Daily HQ Free Trial — Service Worker
// Raise the number in CACHE (v1 -> v2) whenever you upload a new index.html.
const CACHE = 'daily-hq-demo-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
const PDF_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.concat([PDF_LIB_URL]).map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (e.request.url === PDF_LIB_URL) {
    e.respondWith(caches.match(PDF_LIB_URL).then(c => c || fetch(e.request).then(r => { const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(PDF_LIB_URL, cl)); return r; })));
    return;
  }
  if (url.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r && r.status === 200 && r.type === 'basic') { const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, cl)); }
    return r;
  }).catch(() => caches.match(e.request).then(c => c || caches.match('./index.html'))));
});
