const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function check() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ls -l /usr/bin/node /usr/local/bin/node');
    console.log(res.stdout, res.stderr);
    res = await ssh.execCommand('apt-get install -yq nodejs');
    console.log(res.stdout, res.stderr);
    ssh.dispose();
}
check();
