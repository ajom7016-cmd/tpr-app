const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findGenerateTasks() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let r = await ssh.execCommand('grep -n "generateTasks" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("GENERATE TASKS OCCURRENCES:\n", r.stdout);
    ssh.dispose();
}
findGenerateTasks();
