const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function countScript() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let code = r.stdout;
    console.log('Occurrences:', (code.match(/updateVipUI/g) || []).length);
    ssh.dispose();
}
countScript();
