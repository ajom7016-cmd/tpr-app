const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findHistory() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('find /var/www/jmj_app/public -name "code.html" | grep history');
    console.log(res.stdout);
    ssh.dispose();
}
findHistory().catch(console.error);
