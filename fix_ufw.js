const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fix() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ufw status');
    console.log(res.stdout);
    await ssh.execCommand('ufw allow 80/tcp');
    await ssh.execCommand('ufw allow 3000/tcp');
    res = await ssh.execCommand('curl -s http://localhost:3000/landing.html | head -n 5');
    console.log("CURL LOCALHOST:\n", res.stdout);
    ssh.dispose();
}
fix();
