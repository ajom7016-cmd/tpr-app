const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function countAnimations() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let r1 = await ssh.execCommand('grep -c "popUpStagger" /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    console.log("Profile popUpStagger count:", r1.stdout.trim());
    
    let r2 = await ssh.execCommand('grep -c "stagger" /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    console.log("Profile stagger count:", r2.stdout.trim());
    
    let r3 = await ssh.execCommand('grep -c "popUpStagger" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    console.log("VIP popUpStagger count:", r3.stdout.trim());
    
    let r4 = await ssh.execCommand('grep -c "stagger" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    console.log("VIP stagger count:", r4.stdout.trim());

    // Also check what the duplicates actually look like!
    let r5 = await ssh.execCommand('grep "popUpStagger" /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    console.log("Profile popUpStagger lines:\\n", r5.stdout);
    
    let r6 = await ssh.execCommand('grep "popUpStagger" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    console.log("VIP popUpStagger lines:\\n", r6.stdout);

    ssh.dispose();
}
countAnimations();
