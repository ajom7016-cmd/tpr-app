const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixBlackFlash() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Replace black background colors with light gray
    html = html.replace(/background-color: #2a2d34/g, 'background-color: #f1f5f9');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Black flash background fixed!");
    ssh.dispose();
}
fixBlackFlash().catch(console.error);
