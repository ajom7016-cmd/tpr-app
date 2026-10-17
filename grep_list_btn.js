const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepListBtn() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html | grep -B 2 -A 15 "\\.list-btn"');
    console.log(r.stdout);
    ssh.dispose();
}
grepListBtn();
