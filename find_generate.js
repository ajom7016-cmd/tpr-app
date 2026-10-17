const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findGenerate() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -B 5 -A 5 "generateTasks();" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("generateTasks call:\n", res.stdout);
    ssh.dispose();
}
findGenerate().catch(console.error);
