const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAllNewlines() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/investment_premium_glass/vip.html');
    let code = r.stdout;
    let occurrences = [...code.matchAll(/\\n/g)];
    occurrences.forEach(match => {
        let idx = match.index;
        console.log("-------------------");
        console.log(code.substring(idx - 50, idx + 50));
    });
    ssh.dispose();
}
grepAllNewlines();
