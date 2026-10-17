const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAnim() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "popUpStagger" /var/www/jmj_app/public/ -m 1 -A 10');
    console.log(res.stdout);
    ssh.dispose();
}
grepAnim();
