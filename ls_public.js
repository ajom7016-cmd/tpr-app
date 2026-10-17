const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ls2() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('ls -la /var/www/jmj_app/public/');
    console.log(r.stdout);
    ssh.dispose();
}
ls2();
