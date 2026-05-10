const CACHE_NAME = 'ita-bilan-v1';

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/profile/',
  '/card-setup/',
  '/form/',
  '/history/',
  '/settings/',
  '/manifest.json',
  '/fonts/Cairo-Latin.woff2',
  '/fonts/Cairo-LatinExt.woff2',
  '/fonts/Cairo-Arabic.woff2',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Ignore Next.js RSC/internal requests
  if (
    url.includes('?_rsc=') ||
    url.includes('__next') ||
    url.endsWith('.txt')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});