const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepKeyframes() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html | grep -B 2 -A 2 "0% { opacity: 0; }"');
    console.log(r.stdout);
    ssh.dispose();
}
grepKeyframes();
