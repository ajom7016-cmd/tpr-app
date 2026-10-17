const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixOTPModal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html');
    let html = res.stdout;
    
    // Add opacity: 0; to the .modal-overlay CSS block
    html = html.replace(/pointer-events: none; transition: opacity 0\.3s;/g, 'opacity: 0; pointer-events: none; transition: opacity 0.3s;');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/login.html`);
    console.log("OTP Modal successfully hidden by default!");
    ssh.dispose();
}
fixOTPModal().catch(console.error);
