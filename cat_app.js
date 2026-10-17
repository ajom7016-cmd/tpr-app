const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function catApp() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html');
    console.log(res.stdout.substring(0, 2000));
    ssh.dispose();
}
catApp();
