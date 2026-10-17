const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function downloadSrv() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js | grep -C 2 "roiMap"');
    console.log(res.stdout);
    ssh.dispose();
}
downloadSrv().catch(console.error);
