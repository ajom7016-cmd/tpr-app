const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepRegister() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "/api/register" /var/www/jmj_app/public/');
    console.log("Output: ", res.stdout);
    
    let res2 = await ssh.execCommand('grep -rn "/api/login" /var/www/jmj_app/public/');
    console.log("Login Output: ", res2.stdout);
    ssh.dispose();
}
grepRegister().catch(console.error);
