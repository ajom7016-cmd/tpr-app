const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getDogSize() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('find /var/www/jmj_app/public -name "*dog*" | xargs ls -lh');
    console.log(res.stdout);
    ssh.dispose();
}
getDogSize().catch(console.error);
