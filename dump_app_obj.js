const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpAppObj() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -A 20 "APP = {"');
    console.log("APP Obj:\n", res.stdout);
    ssh.dispose();
}
dumpAppObj().catch(console.error);
