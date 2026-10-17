const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const ssh = new NodeSSH();

async function createPWA() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Create manifest.json
    const manifest = {
        "name": "TPR - The Pet Royal",
        "short_name": "TPR",
        "start_url": "/app.html",
        "display": "standalone",
        "background_color": "#2a2d34",
        "theme_color": "#ea580c",
        "orientation": "portrait",
        "icons": [
            {
                "src": "/assets/logo.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/assets/logo.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    };
    
    await ssh.execCommand(`echo '${JSON.stringify(manifest)}' > /var/www/jmj_app/public/manifest.json`);
    
    // 2. Create sw.js (Service Worker)
    const sw = `
    const CACHE_NAME = 'tpr-cache-v1';
    self.addEventListener('install', (event) => {
        self.skipWaiting();
    });
    self.addEventListener('fetch', (event) => {
        // Just a pass-through fetch for now so it passes the PWA install criteria
        event.respondWith(fetch(event.request));
    });
    `;
    
    await ssh.execCommand(`echo "${sw}" > /var/www/jmj_app/public/sw.js`);
    
    console.log("PWA Manifest and Service Worker created!");
    ssh.dispose();
}
createPWA().catch(console.error);
