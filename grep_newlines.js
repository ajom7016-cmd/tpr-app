const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepNewlines() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let code = r.stdout;
    let idx = code.indexOf('\\n');
    if (idx !== -1) {
        console.log(code.substring(idx - 100, idx + 100));
    }
    ssh.dispose();
}
grepNewlines();
