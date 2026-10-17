const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function ls() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('ls -la /var/www/jmj_app/public/history_glass/');
    console.log(r.stdout);
    ssh.dispose();
}
ls();
