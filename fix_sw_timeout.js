const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixSWTimeout() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    const script = `
const fs = require('fs');
const swFile = '/var/www/jmj_app/public/sw.js';

const newSW = \`
const CACHE_NAME = 'tpr-super-cache-v27';
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

    // 1. API Requests: Network-First with 3-second timeout fallback to cache (if possible)
    if (url.pathname.startsWith('/api/')) {
        // API responses usually shouldn't be cached, but to prevent hanging on 2G, 
        // we just do standard fetch. 
        return event.respondWith(fetch(event.request).catch(e => {
            return new Response(JSON.stringify({ error: 'Offline' }), { status: 503, headers: {'Content-Type': 'application/json'} });
        }));
    }
    
    // 2. HTML Files: Network-First with 1.5-second Timeout!
    // This gives the best of both worlds: Instant updates on good network, Instant load on bad network!
    if (event.request.headers.get('accept').includes('text/html') || url.pathname.endsWith('.html')) {
        event.respondWith(
            new Promise((resolve) => {
                let isResolved = false;
                
                // Timeout fallback
                const timeoutId = setTimeout(() => {
                    if(!isResolved) {
                        caches.match(event.request).then(cachedResponse => {
                            if(cachedResponse) {
                                isResolved = true;
                                resolve(cachedResponse);
                            }
                        });
                    }
                }, 1500); // 1.5 seconds max wait for HTML

                fetch(event.request).then((networkResponse) => {
                    clearTimeout(timeoutId);
                    if(!isResolved) {
                        isResolved = true;
                        const clonedResponse = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
                        resolve(networkResponse);
                    }
                }).catch(() => {
                    clearTimeout(timeoutId);
                    if(!isResolved) {
                        isResolved = true;
                        caches.match(event.request).then(resolve);
                    }
                });
            })
        );
        return;
    }
    
    // 3. Stale-While-Revalidate for CSS/JS/Images (Instantly load from cache, update in background)
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
console.log('SW updated to use 1.5s Timeout Network-First for HTML!');

// Also bump app.html timestamp
const appFile = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appFile, 'utf8');
app = app.replace(/const timestamp = '1\\.0\\.[0-9]+'/, "const timestamp = '1.0.38'");
fs.writeFileSync(appFile, app);
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/fix_sw_timeout.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/fix_sw_timeout.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
fixSWTimeout().catch(console.error);
