const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findEarning() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js | grep -C 5 "dailyEarning"');
    console.log(res.stdout);
    ssh.dispose();
}
findEarning().catch(console.error);
