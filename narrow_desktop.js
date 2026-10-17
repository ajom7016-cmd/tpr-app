const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function narrowDesktopCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Desktop: reduce max-width from 660px to 520px to expose the armrests
    html = html.replace(/max-width: 660px;/g, 'max-width: 520px;');
    
    // Also reduce padding a little so text fits nicely in 520px
    html = html.replace(/padding: 32px 32px 8px 32px;/g, 'padding: 25px 25px 8px 25px;');
    html = html.replace(/padding: 8px 32px 28px 32px;/g, 'padding: 8px 25px 25px 25px;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Desktop card narrowed to fit between armrests!");
    ssh.dispose();
}
narrowDesktopCard().catch(console.error);
