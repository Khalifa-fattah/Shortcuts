/**
 * Service Worker for Shortcuts Master PWA
 * Caches application shell and assets for offline use.
 */

const CACHE_NAME = 'shortcuts-master-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon.svg',
  './css/themes.css',
  './css/styles.css',
  './css/rtl.css',
  './js/icons.js',
  './js/default-data.js',
  './js/i18n.js',
  './js/db.js',
  './js/gemini.js',
  './js/drive-sync.js',
  './js/ui.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Bypass cache for external APIs (Gemini, Google Drive, Google Identity)
  if (
    requestUrl.origin.includes('googleapis.com') ||
    requestUrl.origin.includes('accounts.google.com') ||
    requestUrl.origin.includes('gstatic.com')
  ) {
    return;
  }

  // Stale-while-revalidate strategy for local assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, if offline and navigation request, return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
