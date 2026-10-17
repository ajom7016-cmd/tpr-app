const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findLoginDemo() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i "isLandingDemo" /var/www/jmj_app/public/login.html');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
findLoginDemo().catch(console.error);
