const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepCodeHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html | grep -n "isLandingDemo"');
    console.log(res.stdout);
    ssh.dispose();
}
grepCodeHtml().catch(console.error);
