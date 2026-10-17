const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function check() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('pm2 status');
    console.log(res.stdout);
    res = await ssh.execCommand('ufw status');
    console.log(res.stdout);
    res = await ssh.execCommand('curl -s http://localhost:3000/landing.html | head -n 5');
    console.log(res.stdout);
    res = await ssh.execCommand('iptables -t nat -L -n -v');
    console.log(res.stdout);
    ssh.dispose();
}
check();
