/* eslint-disable no-restricted-globals */

/* global self, caches, fetch */

const CACHE = 'cache-ce8edd7';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./manifest.json","./index.html","./romeo_a_julie_001.html","./romeo_a_julie_002.html","./romeo_a_julie_003.html","./romeo_a_julie_004.html","./romeo_a_julie_006.html","./romeo_a_julie_005.html","./romeo_a_julie_008.html","./romeo_a_julie_007.html","./romeo_a_julie_009.html","./romeo_a_julie_010.html","./romeo_a_julie_011.html","./romeo_a_julie_012.html","./fonts/Literata-Italic-var.woff2","./fonts/Literata-var.woff2","./fonts/LiterataTT-TextItalic.woff2","./fonts/LiterataTT-TextSemibold.woff2","./fonts/LiterataTT_LICENSE.txt","./fonts/LiterataTT-TextRegular.woff2","./fonts/SpaceGroteskVF.woff2","./fonts/SpaceGroteskVF_LICENSE.txt","./resources/image003.jpg","./resources/image001.jpg","./resources/image004.jpg","./resources/obalka_romeo_a_julie2.jpg","./resources/upoutavka_eknihy.jpg","./scripts/bundle.js","./template-images/circles.png","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
