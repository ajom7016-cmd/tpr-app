const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceManifest() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Force cache bust on the manifest link
    html = html.replace(/<link rel="manifest" href="\/manifest\.json(\?v=[0-9]+)?">/g, 
                        '<link rel="manifest" href="/manifest.json?v=' + Date.now() + '">');
                        
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Manifest cache busted!");
    ssh.dispose();
}
forceManifest().catch(console.error);
