const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepNav() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -B 2 -A 2 "code_final.html"');
    console.log(r.stdout);
    ssh.dispose();
}
grepNav();
