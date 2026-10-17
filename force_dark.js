const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function forceDark() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Purge ALL accidental #ffffff or white backgrounds
    html = html.replace(/background-color:\s*#ffffff\s*!important;/g, 'background-color: transparent !important;');
    html = html.replace(/background-color:\s*white\s*!important;/g, 'background-color: transparent !important;');
    html = html.replace(/background:\s*#ffffff\s*!important;/g, 'background: transparent !important;');
    
    // Make sure map wrapper is dark
    html = html.replace(/\.map-wrapper \{[^\}]+#ffffff[^\}]+\}/g, '.map-wrapper { background-color: transparent !important; border: none !important; }');
    
    // Also remove the white background from body if it was set anywhere else
    html = html.replace(/body \{[^}]*background-color:\s*transparent\s*!important;/g, 'body { background-color: #111827 !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Forced dark theme everywhere!");
    ssh.dispose();
}
forceDark().catch(console.error);
