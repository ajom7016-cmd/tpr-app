const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixDesktopCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Desktop: revert max-width to 660px
    html = html.replace(/max-width: 520px;/g, 'max-width: 660px;');
    
    // Desktop: revert padding to original good sizes
    html = html.replace(/padding: 25px 25px 8px 25px;/g, 'padding: 32px 32px 8px 32px;');
    html = html.replace(/padding: 8px 25px 25px 25px;/g, 'padding: 8px 32px 28px 32px;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Desktop card restored to 660px width without affecting mobile!");
    ssh.dispose();
}
fixDesktopCard().catch(console.error);
