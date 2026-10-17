const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html');
    let code = r.stdout;
    console.log(code.substring(2000, 5000));
    ssh.dispose();
}
getBg();
