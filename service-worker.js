/**
 * Service Worker for Shortcuts Master PWA
 * - Caches the application shell for offline use (stale-while-revalidate).
 * - Caches Google Fonts so Cairo / Inter keep working offline.
 * - Never touches API / auth traffic (Gemini, Google Drive, Google Identity).
 */

const CACHE_NAME = 'shortcuts-master-v2';
const FONT_CACHE_NAME = 'shortcuts-master-fonts-v1';
const KNOWN_CACHES = [CACHE_NAME, FONT_CACHE_NAME];

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
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

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => !KNOWN_CACHES.includes(key)).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Google Fonts: stale-while-revalidate in their own cache (opaque responses are fine).
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request).then((response) => {
            if (response && (response.ok || response.type === 'opaque')) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Bypass everything else that is not our own origin (Gemini, Drive, Identity Services...).
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate for local assets.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
