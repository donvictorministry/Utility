const V = 'dvu-3.3';
const FILES = ['./', 'index.html', 'styles.css', 'app.js', 'main.js', 'api.js', 'puzzle.js', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(x => x !== V).map(x => caches.delete(x)))));
  self.clients.claim();
});

/* Network-first for same-origin GETs; the Apps Script API is cross-origin and never touched. */
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(r => { const copy = r.clone(); caches.open(V).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
