const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepTrueBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r1 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html | grep -i "true-bg"');
    console.log("HOME:", r1.stdout);
    let r2 = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip_final.html | grep -i "true-bg"');
    console.log("PLAN:", r2.stdout);
    let r3 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -i "true-bg"');
    console.log("TASKS:", r3.stdout);
    
    // Check Profile too just to be sure!
    let r4 = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code_final.html | grep -i "true-bg"');
    console.log("PROFILE:", r4.stdout);
    ssh.dispose();
}
grepTrueBg();
