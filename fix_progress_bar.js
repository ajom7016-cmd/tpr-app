const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixProgressBar() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -B 5 -A 5 "id=\\"task-progress-bar\\""');
    console.log("Progress Bar HTML:\n", res.stdout);
    
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -A 5 "let progressPercent ="');
    console.log("Progress Bar Logic:\n", res2.stdout);
    ssh.dispose();
}
fixProgressBar().catch(console.error);
