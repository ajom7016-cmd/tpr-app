const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepOpacity() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r1 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html | grep -i "opacity: 0"');
    console.log("HOME:", r1.stdout);
    let r2 = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip_final.html | grep -i "opacity: 0"');
    console.log("PLAN:", r2.stdout);
    let r3 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -i "opacity: 0"');
    console.log("TASKS:", r3.stdout);
    
    // Also check what file app.html actually points to for Plan and Tasks!
    let r4 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep investment_premium_glass');
    console.log("APP PLAN:", r4.stdout);
    let r5 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep glassmorphic_2');
    console.log("APP TASKS:", r5.stdout);
    
    ssh.dispose();
}
grepOpacity();
