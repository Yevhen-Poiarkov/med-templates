const CACHE = 'templates-cache-v1';
const PREF = '/med-templates/';
const FILES = [
  PREF,
  PREF + 'index.html',
  PREF + 'app.js',
  PREF + 'manifest.json',
  PREF + 'service-worker.js',
  PREF + 'icons/icon-192.png',
  PREF + 'icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
