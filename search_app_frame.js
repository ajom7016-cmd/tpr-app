const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function searchAppFrame() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('grep -n "app-frame" /var/www/jmj_app/public/app.html');
    console.log("APP-FRAME OCCURRENCES:\n", r.stdout);
    ssh.dispose();
}
searchAppFrame();
