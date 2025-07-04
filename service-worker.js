const CACHE_NAME = 'quiz-app-cache-v4'; // Increment the version to force an update
const urlsToCache = [
  './',
  './index.html',
  './quiz.html',
  './how-to.html',
  './style.css',
  './hero-image.svg',
  './icon-512.png',
  './icon-192.png',
  // We no longer cache external scripts, as it causes issues.
];

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Install the service worker and cache local files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching local app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- THE CORRECTED FETCH LOGIC ---
self.addEventListener('fetch', event => {
  // Check if the request is for an external resource (not on our own domain)
  // Or if it is a request to our Supabase API
  if (
    !event.request.url.startsWith(self.location.origin) ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('countapi.xyz')
  ) {
    // If it's external, do not intercept it. Let it go directly to the network.
    return;
  }

  // For local files, use the cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache, fetch from network
        return fetch(event.request);
      })
  );
});
