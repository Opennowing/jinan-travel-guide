// Service Worker for Jinan Travel Guide PWA
// Cache version — bump to invalidate all caches on deploy
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `jinan-guide-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `jinan-guide-images-${CACHE_VERSION}`;
const OFFLINE_URL = '/jinan-travel-guide/offline.html';

// Core assets to precache on install
const PRECACHE_ASSETS = [
  '/jinan-travel-guide/',
  '/jinan-travel-guide/index.html',
  '/jinan-travel-guide/spots.html',
  '/jinan-travel-guide/food.html',
  '/jinan-travel-guide/itinerary.html',
  '/jinan-travel-guide/guide.html',
  '/jinan-travel-guide/culture.html',
  '/jinan-travel-guide/manifest.json',
  '/jinan-travel-guide/offline.html',
  '/jinan-travel-guide/data/spots.json',
  '/jinan-travel-guide/data/food.json'
];

// ── Install: precache core assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== IMAGE_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch strategies ──
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Route to the right strategy
  if (isImageRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirstWithOffline(request));
  } else {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});

// ── Strategy: Cache First (with background update) ──
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    // Update cache in background (fire-and-forget)
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          cache.put(request, response);
        }
      })
      .catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// ── Strategy: Stale-While-Revalidate (for images) ──
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always try to update in background
  const fetchPromise = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached); // Fallback to cached if offline

  return cached || fetchPromise;
}

// ── Strategy: Network First with Offline Fallback (for navigation) ──
async function networkFirstWithOffline(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Serve offline page
    const offline = await cache.match(OFFLINE_URL);
    return offline || new Response('离线模式 — 请检查网络连接', {
      status: 503,
      headers: { 'Content-Type': 'text/html;charset=utf-8' }
    });
  }
}

// ── Helpers ──
function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/i.test(url.pathname);
}

function isStaticAsset(url) {
  return /\.(css|js|json|woff2?|ttf|eot)(\?.*)?$/i.test(url.pathname) ||
         url.pathname.startsWith('/jinan-travel-guide/data/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}
