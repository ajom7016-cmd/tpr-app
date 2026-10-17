const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function verify() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep "tab-btn" /var/www/jmj_app/public/glassmorphic_3/code.html');
    console.log(res.stdout);
    ssh.dispose();
}
verify().catch(console.error);
