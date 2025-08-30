// Development service worker - Caching is disabled.

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Take control of all clients as soon as the worker is activated.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Bypass the cache and go directly to the network.
  event.respondWith(fetch(event.request));
});
