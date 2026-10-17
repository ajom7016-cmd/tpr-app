const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixHeroHeight() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Change hero height on mobile back to 55vw to eliminate dark bands
    html = html.replace(/height: 60vw !important;/g, 'height: 55vw !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Hero height fixed to 55vw!");
    ssh.dispose();
}
fixHeroHeight().catch(console.error);
