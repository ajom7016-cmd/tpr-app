const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixNavbar() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/index.html');
    let html = res.stdout;
    
    html = html.replace(/text-gray-300/g, 'text-gray-700');
    
    let b64 = Buffer.from(html).toString('base64');
    await ssh.execCommand(`echo "${b64}" | base64 -d > /var/www/jmj_app/public/index.html`);
    console.log("Fixed navbar links for light theme!");
    ssh.dispose();
}
fixNavbar().catch(console.error);
