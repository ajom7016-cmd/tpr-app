const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixPWAStart() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Update manifest.json
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/manifest.json');
    let manifest = res2.stdout;
    manifest = manifest.replace(/"start_url":"\/app\.html"/g, '"start_url":"/login.html"');
    let b64m = Buffer.from(manifest).toString('base64');
    await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);

    // 2. Add standalone detection to index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    const pwaScript = `
    <script>
        // If the app is launched as a PWA, immediately redirect to the real app (login page)
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            window.location.replace('/login.html');
        }
    </script>
    `;
    
    if (!html.includes('display-mode: standalone')) {
        html = html.replace('</head>', pwaScript + '\n</head>');
    }
    
    // Also update the manifest link cache buster
    html = html.replace(/manifest\.json\?v=[0-9]+/g, 'manifest.json?v=' + Date.now());

    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    console.log("PWA start URL forced to login.html!");
    ssh.dispose();
}
fixPWAStart().catch(console.error);
