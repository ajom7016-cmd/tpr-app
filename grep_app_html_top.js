const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAppHtmlTop() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('sed -n "15,30p" /var/www/jmj_app/public/app.html');
    console.log(res.stdout);
    ssh.dispose();
}
grepAppHtmlTop().catch(console.error);
