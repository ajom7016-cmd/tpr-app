const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAll() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "getUserVip" /var/www/jmj_app/public/');
    console.log(res.stdout);
    ssh.dispose();
}
grepAll().catch(console.error);
