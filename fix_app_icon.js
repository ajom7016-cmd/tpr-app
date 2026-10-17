const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixAppIcon() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Update index.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    html = html.replace(/<link rel="icon" type="image\/png" href="\/assets\/logo\.png">/g, 
                        '<link rel="icon" type="image/svg+xml" href="/assets/app-icon.svg">');
                        
    html = html.replace(/<link rel="apple-touch-icon" href="\/assets\/logo\.png">/g, 
                        '<link rel="apple-touch-icon" href="/assets/app-icon.svg">');
                        
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    
    // 2. Update manifest.json
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/manifest.json');
    let manifest = res2.stdout;
    
    manifest = manifest.replace(/"src":"\/assets\/logo\.png"/g, '"src":"/assets/app-icon.svg"');
    manifest = manifest.replace(/"type":"image\/png"/g, '"type":"image/svg+xml"');
    
    // Change any 192x192 string in sizes since svg doesn't have a strict size limit, but we can leave it or use "any"
    manifest = manifest.replace(/"sizes":"192x192"/g, '"sizes":"any"');
    manifest = manifest.replace(/"sizes":"512x512"/g, '"sizes":"any"');
    
    let b64m = Buffer.from(manifest).toString('base64');
    await ssh.execCommand(`echo "${b64m}" | base64 -d > /var/www/jmj_app/public/manifest.json`);

    console.log("App Icon globally fixed to app-icon.svg!");
    ssh.dispose();
}
fixAppIcon().catch(console.error);
