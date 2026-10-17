const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findBadges() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('ls -la /var/www/jmj_app/public/investment_premium_glass/');
    console.log("Files: ", res.stdout);
    
    let res2 = await ssh.execCommand('grep -i "badge" /var/www/jmj_app/public/investment_premium_glass/*.html');
    console.log("Badge: ", res2.stdout);
    
    let res3 = await ssh.execCommand('grep -ri "FREE PROFILE" /var/www/jmj_app/public/');
    console.log("FREE PROFILE: ", res3.stdout);
    ssh.dispose();
}
findBadges().catch(console.error);
