const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepLoadPage() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -A 20 "function loadPage" /var/www/jmj_app/public/app.html');
    console.log(res.stdout);
    ssh.dispose();
}
grepLoadPage().catch(console.error);
