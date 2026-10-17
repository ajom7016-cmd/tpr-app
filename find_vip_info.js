const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findVipInfo() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -C 5 "vipInfo ="');
    console.log(res.stdout);
    ssh.dispose();
}
findVipInfo().catch(console.error);
