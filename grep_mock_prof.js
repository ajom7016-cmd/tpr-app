const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepMockProfile() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -A 15 "window.APP.getProfile = async function" /var/www/jmj_app/public/js/app.js');
    console.log(res.stdout);
    ssh.dispose();
}
grepMockProfile().catch(console.error);
