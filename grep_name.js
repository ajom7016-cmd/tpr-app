const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepName() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html | grep -A 20 "VIP MEMBER"');
    console.log(r.stdout);
    ssh.dispose();
}
grepName();
