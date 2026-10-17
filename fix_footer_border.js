const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixFooterBorder() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    html = html.replace(/border-top:\s*1px\s*solid\s*rgba\(255,255,255,0\.05\);/g, 'border-top: 1px solid rgba(0,0,0,0.1);');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Fixed footer border for light theme!");
    ssh.dispose();
}
fixFooterBorder().catch(console.error);
