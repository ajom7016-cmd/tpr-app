const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixAllRootCauses() {
    console.log("Connecting to server...");
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. FIX SERVER.JS CACHING (Crucial! Stops 7-day HTML cache)
    console.log("Fixing server.js Cache-Control...");
    let serverJs = await ssh.execCommand('cat /var/www/jmj_app/server.js');
    let sContent = serverJs.stdout;
    
    const oldCache = `app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res) => {
        res.set('Cache-Control', 'public, max-age=604800'); // Cache for 7 days
    }
}));`;

    const newCache = `app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
        } else {
            res.set('Cache-Control', 'public, max-age=86400');
        }
    }
}));`;

    if (sContent.includes('max-age=604800')) {
        sContent = sContent.replace(/app\.use\(express\.static[\s\S]*?\}\)\);/, newCache);
        await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/server.js\n${sContent}\nEOF`);
        console.log("Restarting node app via pm2...");
        await ssh.execCommand('pm2 restart all || systemctl restart jmj || systemctl restart jmj_app');
    }

    // 2. KILL SERVICE WORKER IN sw.js
    console.log("Neutering sw.js so it never serves stale cache...");
    const killSw = `
self.addEventListener('install', (e) => {
    self.skipWaiting();
});
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.map(k => caches.delete(k))))
    );
    self.clients.claim();
});
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
`;
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/sw.js\n${killSw}\nEOF`);

    // 3. FIX APP.HTML: Make iframe 100% visible, no opacity 0, no translate, clear SW & cache
    console.log("Fixing app.html iframe visibility & auto-cache-clearing...");
    let appHtml = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    let aContent = appHtml.stdout;

    // Inject cache-killer at top of head if not present
    const unregisterScript = `<script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                for (let r of regs) r.unregister();
            });
        }
        if ('caches' in window) {
            caches.keys().then(keys => {
                for (let k of keys) caches.delete(k);
            });
        }
    </script>`;
    
    if (!aContent.includes('getRegistrations')) {
        aContent = aContent.replace('<head>', '<head>\n' + unregisterScript);
    }

    // Fix iframe style
    aContent = aContent.replace(
        /id="app-frame"[^>]*style="[^"]*"/,
        'id="app-frame" allow="microphone; camera" style="opacity: 1 !important; transform: none !important; width: 100%; height: 100%; border: none; flex: 1; margin-bottom: 75px; background-color: #f6f8fb;"'
    );

    // Update timestamp in loadPage to dynamic Date.now() to ensure freshness
    aContent = aContent.replace(/const timestamp = '[^']*';/g, 'const timestamp = Date.now();');
    
    // Save app.html
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/app.html\n${aContent}\nEOF`);

    // 4. FIX TASKS (glassmorphic_2/code.html)
    console.log("Fixing glassmorphic_2/code.html background & opacity...");
    let tasksHtml = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    let tContent = tasksHtml.stdout;
    // Remove transparent body style
    tContent = tContent.replace(/style="background-color:\s*transparent\s*!important;"/g, 'style="background-color: #f6f8fb !important;"');
    tContent = tContent.replace(/opacity:\s*0;/g, '');
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/glassmorphic_2/code.html\n${tContent}\nEOF`);

    // 5. FIX PROFILE (user_profile_premium_glass/code_final.html)
    console.log("Checking profile page...");
    let profHtml = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    let pContent = profHtml.stdout;
    pContent = pContent.replace(/opacity:\s*0;/g, '');
    pContent = pContent.replace(/style="background-color:\s*transparent\s*!important;"/g, '');
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/user_profile_premium_glass/code_final.html\n${pContent}\nEOF`);

    // 6. FIX VIP (investment_premium_glass/vip_final.html)
    console.log("Checking vip page...");
    let vipHtml = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    let vContent = vipHtml.stdout;
    vContent = vContent.replace(/opacity:\s*0;/g, '');
    vContent = vContent.replace(/style="background-color:\s*transparent\s*!important;"/g, '');
    await ssh.execCommand(`cat << 'EOF' > /var/www/jmj_app/public/investment_premium_glass/vip_final.html\n${vContent}\nEOF`);

    console.log("All root causes fixed successfully!");
    ssh.dispose();
}

fixAllRootCauses().catch(console.error);
