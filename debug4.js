const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function check() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ps aux | grep dpkg');
    console.log(res.stdout);
    res = await ssh.execCommand('ps aux | grep apt');
    console.log(res.stdout);
    ssh.dispose();
}
check();
