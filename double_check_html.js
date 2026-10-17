const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function doubleCheckHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -B 3 -A 15 "vip-user-pic" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("Image HTML:\n", res.stdout);
    ssh.dispose();
}
doubleCheckHtml().catch(console.error);
