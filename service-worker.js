// A unique version identifier for this service worker.
// Changing this string will force the browser to install the new service worker.
const DEV_VERSION = 'v1.0.0-dev';

// --- INSTALL: Take control immediately ---
// The install event is fired when a new service worker is installed.
self.addEventListener('install', (event) => {
  console.log('DEV Service Worker: Installing...');
  // self.skipWaiting() forces the waiting service worker to become the
  // active service worker. This is essential for development to see
  // changes immediately.
  event.waitUntil(self.skipWaiting());
});

// --- ACTIVATE: Clean up old caches and take control of all pages ---
// The activate event is fired when the service worker becomes active.
self.addEventListener('activate', (event) => {
  console.log('DEV Service Worker: Activating...');

  // Create a promise that resolves when all old caches are deleted.
  const cacheCleanup = async () => {
    const cacheNames = await caches.keys();
    // Delete all caches. In a development environment, we don't want
    // to persist any old data.
    await Promise.all(
      cacheNames.map(cacheName => {
        console.log('DEV Service Worker: Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
    // self.clients.claim() ensures that the new service worker takes control
    // of any open pages that were previously controlled by an old worker.
    await self.clients.claim();
  };

  event.waitUntil(cacheCleanup());
});

// --- FETCH: The "Network Only" Strategy ---
// The fetch event is fired for every network request made by the page.
self.addEventListener('fetch', (event) => {
  // For development, we explicitly bypass the cache and go directly to the network.
  // This ensures we always get the latest version of every file.
  event.respondWith(fetch(event.request));
});
