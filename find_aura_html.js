const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findAuraHtml() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html | grep -B 2 -A 5 "class=\\"aura-bg\\""');
    console.log(r.stdout);
    ssh.dispose();
}
findAuraHtml();
