const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAppJsExact() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('sed -n "415,420p" /var/www/jmj_app/public/js/app.js');
    console.log(res.stdout);
    ssh.dispose();
}
grepAppJsExact().catch(console.error);
