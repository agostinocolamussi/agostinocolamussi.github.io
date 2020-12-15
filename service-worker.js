'use strict';

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
const CACHE_VERSION = 1;
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
const OFFLINE_URL = 'offline.html';

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});

  if ('cache' in request) {
    return request;
  }

  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}

self.addEventListener('install', event => {
  event.waitUntil(
    fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
      return caches.open(CURRENT_CACHES.offline).then(function(cache) {
        return cache.put(OFFLINE_URL, response);
      });
    })
  );
});

self.addEventListener('activate', event => {
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' ||
      (event.request.method === 'GET' &&
       event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(error => {
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
window.addEventListener('load', () => {
  
      const base = document.querySelector('base');

      let baseUrl = base && base.href || '';
  
      if (!baseUrl.endsWith('/')) {
  
          baseUrl = `${baseUrl}/`;
  
      }  
  
    
  
      if ('serviceWorker' in navigator) {
  
          navigator.serviceWorker.register(`${baseUrl}sw.js`)
  
              .then( registration => {
  
              // Registration was successful
  
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
  
          })
  
          .catch(err => {
  
              // registration failed :(
  
              console.log('ServiceWorker registration failed: ', err);
  
          });
  
      }
  
  });    
  self.addEventListener('fetch', event => {
  
      console.log('[Service Worker] Fetching something ....', event);
  
  
      // This fixes a weird bug in Chrome when you open the Developer Tools
  
      if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
  
          return;
  
      }
  
  
      event.respondWith(fetch(event.request));
  
  });