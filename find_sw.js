const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('grep -rn "serviceWorker.register" /var/www/jmj_app/public/');
    console.log("SW REGISTRATIONS:\n", r.stdout);
    ssh.dispose();
}
findSW();
