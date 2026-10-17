const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixGreyFlash() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Replace grey body backgrounds with transparent
    html = html.replace(/background-color: #f1f5f9/g, 'background-color: transparent');
    html = html.replace(/background: #f1f5f9/g, 'background: transparent');
    
    // In case there is an inline style like body { background-color: #f1f5f9 !important; }
    html = html.replace(/body \{ background-color: transparent !important; \}/g, 'body { background-color: transparent !important; }');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Grey body flash removed from index.html!");
    ssh.dispose();
}
fixGreyFlash().catch(console.error);
