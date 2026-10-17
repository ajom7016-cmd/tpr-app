const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepAppJsFull() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/js/app.js | grep -n "isLandingDemo"');
    console.log(res.stdout);
    ssh.dispose();
}
grepAppJsFull().catch(console.error);
