const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceBustManifest() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/manifest.json');
    let manifestObj = JSON.parse(res.stdout);
    
    // Completely new query param
    const stamp = Date.now();
    manifestObj.start_url = "/login.html?v=" + stamp;
    manifestObj.id = "/?v=" + stamp;
    
    let b64m = Buffer.from(JSON.stringify(manifestObj)).toString('base64');
    await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);

    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res2.stdout;
    html = html.replace(/window\.location\.replace\('\/login\.html\?v=[0-9]+'\);/g, "window.location.replace('/login.html?v=" + stamp + "');");
    html = html.replace(/manifest\.json\?v=[0-9]+/g, 'manifest.json?v=' + stamp);
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);

    console.log("Forced bust manifest");
    ssh.dispose();
}
forceBustManifest().catch(console.error);
