const CACHE_NAME = 'quiz-app-cache-v1';
// Add all your essential files here.
const urlsToCache = [
  './',
  './index.html',
  './quiz.html',
  './how-to.html',
  './style.css',
  './hero-image.svg',
  './icon-512.png'
  // Add any other images or scripts you might have
];

// Install the service worker and cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
