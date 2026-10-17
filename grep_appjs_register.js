const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAppJsRegister() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i -C 5 "APP.register =" /var/www/jmj_app/public/js/app.js');
    console.log("Output: ", res.stdout);
    ssh.dispose();
}
grepAppJsRegister().catch(console.error);
