// Self-destructing service worker: wipes all caches and unregisters itself immediately
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((k) => caches.delete(k)));
        }).then(() => {
            return self.registration.unregister();
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Never intercept or cache; always fetch directly from network
    e.respondWith(fetch(e.request));
});
