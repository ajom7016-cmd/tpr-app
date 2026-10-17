const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpServerApi2() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js | grep -A 35 "app.get(\'/api/recent-earnings\'"');
    console.log("Task API:\n", res.stdout);
    ssh.dispose();
}
dumpServerApi2().catch(console.error);
