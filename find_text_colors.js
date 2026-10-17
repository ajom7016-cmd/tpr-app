const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findTextColors() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i "#1e293b" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
findTextColors().catch(console.error);
