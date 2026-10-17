const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function forceCacheBust() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Fix sw.js Cache Name
    const script = `
const fs = require('fs');
const swPath = '/var/www/jmj_app/public/sw.js';
let sw = fs.readFileSync(swPath, 'utf8');

// Replace the cache name with a completely random new one
sw = sw.replace(/const CACHE_NAME = 'tpr-super-cache-[^']+';/, "const CACHE_NAME = 'tpr-super-cache-" + Date.now() + "';");

// ALSO, let's inject a piece of code into app.html that automatically forces a hard reload
// if it detects an older version.
const appPath = '/var/www/jmj_app/public/app.html';
let app = fs.readFileSync(appPath, 'utf8');

if (!app.includes('forceReloadVersion')) {
    const versionBuster = \`
    <script>
        // Auto-refresh mechanism
        const currentVersion = "\${Date.now()}";
        const savedVersion = localStorage.getItem('appVersion');
        if (savedVersion !== currentVersion) {
            localStorage.setItem('appVersion', currentVersion);
            
            // Clear all service worker caches manually to ensure immediate update
            if ('caches' in window) {
                caches.keys().then((names) => {
                    for (let name of names) caches.delete(name);
                });
            }
            
            window.location.reload(true);
        }
    </script>
    \`;
    app = app.replace('</head>', versionBuster + '\\n</head>');
    fs.writeFileSync(appPath, app);
} else {
    // If it's already there, just update the timestamp
    app = app.replace(/const currentVersion = "[^"]+";/, 'const currentVersion = "' + Date.now() + '";');
    fs.writeFileSync(appPath, app);
}

fs.writeFileSync(swPath, sw);
console.log('Successfully forced cache update!');
    `;
    
    let b64 = Buffer.from(script).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/force_cache.js`);
    let res = await ssh.execCommand('node /var/www/jmj_app/force_cache.js');
    console.log(res.stdout);
    
    ssh.dispose();
}
forceCacheBust().catch(console.error);
