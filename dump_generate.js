const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpGenerateTasks() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html');
    
    const code = res.stdout;
    const start = code.indexOf('async function generateTasks() {');
    const end = code.indexOf('    // Set username dynamically for the new VIP card');
    console.log(code.substring(start, end));
    
    ssh.dispose();
}
dumpGenerateTasks().catch(console.error);
