const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getCutoutSize() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ls -lh /var/www/jmj_app/public/cutout_hd.png');
    console.log(res.stdout);
    ssh.dispose();
}
getCutoutSize().catch(console.error);
