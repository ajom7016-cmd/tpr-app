const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepCheckAuth() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -c "checkAuth" /var/www/jmj_app/public/glassmorphic_1/code.html');
    console.log(res.stdout);
    ssh.dispose();
}
grepCheckAuth().catch(console.error);
