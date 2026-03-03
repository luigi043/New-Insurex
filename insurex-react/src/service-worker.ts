export { };
/// <reference lib="webworker" />

const sw = self as any;

const CACHE_NAME = 'insurex-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
];

sw.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

sw.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response: any) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((res: any) => {
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }
        const responseToCache = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return res;
      });
    })
  );
});

sw.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName: any) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
});