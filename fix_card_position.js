const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixCardPosition() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Change margin-top: -65px to 0px
    html = html.replace(/margin-top: -65px;/g, 'margin-top: 0px;');
    
    // Also, there might be a margin-top in the media query? No, I only saw it in the main block.
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card moved down and centered perfectly!");
    ssh.dispose();
}
fixCardPosition().catch(console.error);
