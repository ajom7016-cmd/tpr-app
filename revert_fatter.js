const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function revertFatter() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    // Revert padding & width to halfway point
    
    // Desktop:
    html = html.replace(/padding: 35px 35px 10px 35px;/g, 'padding: 32px 32px 8px 32px;');
    html = html.replace(/padding: 10px 35px 30px 35px;/g, 'padding: 8px 32px 28px 32px;');
    html = html.replace(/max-width: 680px;/g, 'max-width: 660px;');
    
    // Mobile:
    html = html.replace(/padding: 20px 20px 5px 20px !important;/g, 'padding: 18px 18px 2px 18px !important;');
    html = html.replace(/padding: 5px 20px 20px 20px !important;/g, 'padding: 2px 18px 18px 18px !important;');
    html = html.replace(/width: 90% !important;/g, 'width: 87% !important;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Card thickness reduced slightly!");
    ssh.dispose();
}
revertFatter().catch(console.error);
