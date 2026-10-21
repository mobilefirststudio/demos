const CACHE = 'simple-finance-hub-demo-v3';
const CACHE_HOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './manifest.json', './icon-192.png', './icon-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  const keep = r => r && (r.ok || r.type === 'opaque');
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { if (keep(r)) { const c = r.clone(); caches.open(CACHE).then(x => x.put('./', c)); } return r; }).catch(() => caches.match('./')));
    return;
  }
  if (u.origin !== location.origin && !CACHE_HOSTS.includes(u.hostname)) return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (keep(r)) { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; })));
});
