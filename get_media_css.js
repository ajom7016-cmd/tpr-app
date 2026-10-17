const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getMedia() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -A 50 "@media (max-width: 768px)" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
getMedia().catch(console.error);
