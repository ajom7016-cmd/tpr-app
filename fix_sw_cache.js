const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const swFile = '/var/www/jmj_app/public/sw.js';

const newSW = \`
const CACHE_NAME = 'tpr-super-cache-v26';
const PRECACHE_URLS = [
    '/',
    '/login.html',
    '/app.html',
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
    const url = new URL(event.request.url);

    // 1. Network-Only for API requests
    if (url.pathname.startsWith('/api/')) {
        return event.respondWith(fetch(event.request));
    }
    
    // 2. Network-First for HTML (Ensures instant updates without caching issues)
    if (event.request.headers.get('accept').includes('text/html') || url.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(event.request).then((networkResponse) => {
                const clonedResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clonedResponse);
                });
                return networkResponse;
            }).catch(() => {
                return caches.match(event.request);
            })
        );
        return;
    }
    
    // 3. Stale-While-Revalidate for CSS/JS/Images (Super fast loading for low network)
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
\`;

fs.writeFileSync(swFile, newSW);
console.log('SW updated to use Network-First for HTML and Stale-While-Revalidate for assets!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_sw.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_sw.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixSW().catch(console.error);
