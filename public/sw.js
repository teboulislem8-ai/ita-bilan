const CACHE = 'fdps-v1';

const ASSETS = [
  '/',
  '/form',
  '/history',
  '/settings',
  '/profile',
  '/card-setup',
  '/fonts/Cairo-Latin.woff2',
  '/fonts/Cairo-LatinExt.woff2',
  '/fonts/Cairo-Arabic.woff2',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
