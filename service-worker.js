var cacheName = 'pwa-agostinocolamussi.github.io';
var filesToCache = [
'/',
'/index.html',
'/contenuti/cache/min/1/1d1ee75c5cc7ed8d6de45c7b4972eeab.css',
'/contenuti/cache/min/1/189ffae5acefc239410d698e61e0ad2e.js',
'/contenuti/cache/min/1/bc0a64c3a966c0b6843a9753a0438227.css',
'/contenuti/cache/min/1/c51b64b9e13c6db0ef718482620d736f.js',
'/favicon.ico'
]; 
/* Avvia il Service Worker e Memorizza il contenuto nella cache */
self.addEventListener('install', function(e) {
e.waitUntil(
caches.open(cacheName).then(function(cache) {
return cache.addAll(filesToCache);
})
);
}); 
/* Serve i Contenuti Memorizzati quando sei Offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
  caches.match(e.request).then(function(response) {
  return response || fetch(e.request);
  })
  );
  });