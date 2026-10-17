const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function doubleCheckHistory() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_3/code.html | grep -C 10 "switchTab"');
    console.log("HTML/JS:\n", res.stdout);
    ssh.dispose();
}
doubleCheckHistory().catch(console.error);
