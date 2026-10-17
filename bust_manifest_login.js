const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function bustManifestLogin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // Read manifest
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/manifest.json');
    let manifestObj = JSON.parse(res.stdout);
    
    // Change start_url to bypass Chrome cache
    manifestObj.start_url = "/login.html?v=" + Date.now();
    manifestObj.id = "/?v=" + Date.now();
    
    let b64m = Buffer.from(JSON.stringify(manifestObj)).toString('base64');
    await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);

    // Update index.html manifest link
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res2.stdout;
    
    // Also update the standalone detection script in index.html to redirect to the new versioned login url
    html = html.replace(/window\.location\.replace\('\/login\.html'\);/g, "window.location.replace('/login.html?v=" + Date.now() + "');");
    html = html.replace(/manifest\.json\?v=[0-9]+/g, 'manifest.json?v=' + Date.now());
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    console.log("Start URL cache busted!");
    ssh.dispose();
}
bustManifestLogin().catch(console.error);
