const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepBg3d() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html | grep "<div class=\\"bg-3d\\">"');
    console.log("PROFILE:", r.stdout);
    
    let r2 = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip_final.html | grep "<div class=\\"bg-3d\\">"');
    console.log("VIP:", r2.stdout);
    
    ssh.dispose();
}
grepBg3d();
