const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAllRegister() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "/api/register" /var/www/jmj_app/public/js/');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
grepAllRegister().catch(console.error);
