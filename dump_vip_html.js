const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpVipHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html | grep -B 2 -A 60 "const plans ="');
    console.log("VIP Script:\n", res.stdout);
    ssh.dispose();
}
dumpVipHtml().catch(console.error);
