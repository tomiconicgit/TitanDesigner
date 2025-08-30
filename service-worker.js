// This is a basic service worker. 
// For now, it just allows the app to be installable (fulfills PWA criteria).
// We can add caching strategies later.

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
});

self.addEventListener('fetch', (event) => {
  // We're not intercepting requests yet.
});
