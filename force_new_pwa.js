const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceNewPWA() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/manifest.json');
    let manifest = res.stdout;
    
    // Add an id to the manifest to make Chrome think it's a totally new app, bypassing Windows Icon Cache
    const manifestObj = JSON.parse(manifest);
    manifestObj.id = "/?v=" + Date.now(); // Unique ID
    
    // Update the icon URLs with a query string to force re-download
    manifestObj.icons[0].src = "/assets/app-icon-192.png?v=" + Date.now();
    manifestObj.icons[1].src = "/assets/app-icon-512.png?v=" + Date.now();
    
    let b64m = Buffer.from(JSON.stringify(manifestObj)).toString('base64');
    await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);

    // Also update the manifest link in index.html with a new cache buster
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res2.stdout;
    html = html.replace(/manifest\.json\?v=[0-9]+/g, 'manifest.json?v=' + Date.now());
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    console.log("PWA Manifest randomized to bypass Windows Icon Cache!");
    ssh.dispose();
}
forceNewPWA().catch(console.error);
