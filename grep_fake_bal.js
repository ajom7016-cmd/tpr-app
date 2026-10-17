const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepFakeBalance() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -B 10 -A 20 "8,45,600" /var/www/jmj_app/public/glassmorphic_1/code.html');
    console.log(res.stdout);
    ssh.dispose();
}
grepFakeBalance().catch(console.error);
