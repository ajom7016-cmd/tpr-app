const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function tweakCard() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // 1. Move it a little bit up (margin-top: -30px instead of 0px)
    html = html.replace(/margin-top: 0px;/g, 'margin-top: -30px;');
    
    // 2. Make it a bit "fatter" (wider and more padding)
    // Desktop:
    html = html.replace(/padding: 30px 30px 5px 30px;/g, 'padding: 35px 35px 10px 35px;');
    html = html.replace(/padding: 5px 30px 25px 30px;/g, 'padding: 10px 35px 30px 35px;');
    html = html.replace(/max-width: 650px;/g, 'max-width: 680px;'); // slightly wider
    
    // Mobile:
    html = html.replace(/padding: 15px 15px 0px 15px !important;/g, 'padding: 20px 20px 5px 20px !important;');
    html = html.replace(/padding: 0px 15px 15px 15px !important;/g, 'padding: 5px 20px 20px 20px !important;');
    html = html.replace(/width: 85% !important;/g, 'width: 90% !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card moved up and made slightly fatter!");
    ssh.dispose();
}
tweakCard().catch(console.error);
