const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function upgradeSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const ultraSW = `const CACHE_NAME = 'tpr-super-cache-v2';
const PRECACHE_URLS = [
    '/',
    '/login.html',
    '/app.html',
    '/glassmorphic_1/code.html',
    '/glassmorphic_2/code.html',
    '/investment_premium_glass/vip.html',
    '/user_profile_premium_glass/code.html',
    '/assets/tailwind-compiled.css',
    '/assets/app-icon-192.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if(key !== CACHE_NAME) return caches.delete(key);
            })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Don't cache API requests
    if (event.request.url.includes('/api/')) {
        return event.respondWith(fetch(event.request));
    }
    
    // Stale-while-revalidate for everything else (Super Fast!)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            }).catch(() => {});
            
            return cachedResponse || fetchPromise;
        })
    );
});
`;

    await ssh.execCommand(`echo "${Buffer.from(ultraSW).toString('base64')}" | base64 -d > /var/www/jmj_app/public/sw.js`);
    console.log("Service Worker upgraded to Ultra Cache mode!");
    
    ssh.dispose();
}
upgradeSW().catch(console.error);
