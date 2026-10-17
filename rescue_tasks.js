const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function rescueTasks() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -B 10 -A 15 "fetchAndSetName" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("Fetch block:\n", res.stdout);
    
    // Check if generateTasks is called anywhere!
    let res2 = await ssh.execCommand('grep "generateTasks()" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("All generateTasks calls:\n", res2.stdout);
    
    ssh.dispose();
}
rescueTasks().catch(console.error);
