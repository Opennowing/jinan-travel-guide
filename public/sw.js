// Service Worker for Jinan Travel Guide PWA
const CACHE_NAME = 'jinan-guide-v1';
const ASSETS = [
  '/jinan-travel-guide/',
  '/jinan-travel-guide/index.html',
  '/jinan-travel-guide/spots.html',
  '/jinan-travel-guide/food.html',
  '/jinan-travel-guide/itinerary.html',
  '/jinan-travel-guide/guide.html',
  '/jinan-travel-guide/culture.html',
  '/jinan-travel-guide/manifest.json'
];

// Install — cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  // Skip non-GET
  if (e.request.method !== 'GET') return;
  // Skip cross-origin (CDN images, API calls)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
