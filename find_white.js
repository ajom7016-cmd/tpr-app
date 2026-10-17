const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findWhiteBg() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -iE "background[^;]*fff" /var/www/jmj_app/public/index.html');
    console.log("fff:");
    console.log(res.stdout);
    res = await ssh.execCommand('grep -iE "background[^;]*white" /var/www/jmj_app/public/index.html');
    console.log("white:");
    console.log(res.stdout);
    ssh.dispose();
}
findWhiteBg().catch(console.error);
