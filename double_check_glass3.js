const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function doubleCheckGlass3() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_3/code.html');
    console.log(res.stdout);
    ssh.dispose();
}
doubleCheckGlass3().catch(console.error);
