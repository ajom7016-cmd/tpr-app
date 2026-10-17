const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function compareCards() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r1 = await ssh.execCommand('grep -A 15 "\\.glass-card {" /var/www/jmj_app/public/glassmorphic_1/code.html');
    console.log("HOME GLASS CARD:\n", r1.stdout);
    let r2 = await ssh.execCommand('grep -A 15 "\\.glass-card {" /var/www/jmj_app/public/investment_premium_glass/vip_final.html');
    console.log("VIP GLASS CARD:\n", r2.stdout);
    let r3 = await ssh.execCommand('grep -A 15 "\\.glass-card {" /var/www/jmj_app/public/user_profile_premium_glass/code_final.html');
    console.log("PROFILE GLASS CARD:\n", r3.stdout);
    ssh.dispose();
}
compareCards();
