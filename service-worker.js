const CACHE = 'med-templates-v1';
const ASSETS = [
  '/med-templates/',
  '/med-templates/index.html',
  '/med-templates/app.js',
  '/med-templates/manifest.json',
  '/med-templates/icons/icon-192.png',
  '/med-templates/icons/icon-512.png'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>self.clients.claim());

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
