/**
 * DV-Utilitiy Service Worker Cache Engine
 */

const CACHE_NAME = 'dv-utilitiy-cache-v2.5';
const ASSETS = [
  'index.html',
  'admin.html',
  'styles.css',
  'app.js',
  'main.js',
  'api.js',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((res) => {
      return (
        res ||
        fetch(e.request).then((netRes) => {
          return netRes;
        })
      );
    })
  );
});
