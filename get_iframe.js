const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getIframe() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -A 2 -B 2 "<iframe" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
getIframe().catch(console.error);
