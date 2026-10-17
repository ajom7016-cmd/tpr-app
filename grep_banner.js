const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepBanner() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "PROMISE REJECTION" /var/www/jmj_app/public/');
    console.log(res.stdout);
    ssh.dispose();
}
grepBanner().catch(console.error);
