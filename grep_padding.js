const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepPadding() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -B 2 -A 5 "padding: 40px" /var/www/jmj_app/public/index.html');
    console.log(res.stdout);
    ssh.dispose();
}
grepPadding().catch(console.error);
