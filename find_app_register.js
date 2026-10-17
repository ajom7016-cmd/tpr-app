const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findAppRegister() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "register" /var/www/jmj_app/public/js/app.js');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
findAppRegister().catch(console.error);
