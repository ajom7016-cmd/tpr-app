const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function analyzeSW() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/sw.js');
    console.log("SW.JS:\n", res.stdout);
    ssh.dispose();
}
analyzeSW().catch(console.error);
