const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function finalDebug() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -B 5 -A 40 "document.getElementById(\'tasks-container\').innerHTML = html;"');
    console.log("generateTasks END:\n", res.stdout);
    ssh.dispose();
}
finalDebug().catch(console.error);
