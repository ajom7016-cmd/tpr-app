const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getTaskComplete() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('sed -n "/app.post(\\'\\/api\\/tasks\\/complete\\', authenticateToken/,/\\});/p" /var/www/jmj_app/server.js');
    console.log(res.stdout);
    ssh.dispose();
}
getTaskComplete().catch(console.error);
