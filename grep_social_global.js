const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepHandleSocialGlobal() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "function handleSocialLogin" /var/www/jmj_app/public/');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
grepHandleSocialGlobal().catch(console.error);
