const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findSpinner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i -B 2 -A 5 "spinner" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
findSpinner().catch(console.error);
