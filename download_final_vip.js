const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function downloadFinalVip() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    const fs = require('fs');
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    fs.writeFileSync('C:/Users/ajom7/Downloads/TPR/JMJ_App/debug_vip_final.html', r.stdout);
    ssh.dispose();
}
downloadFinalVip();
