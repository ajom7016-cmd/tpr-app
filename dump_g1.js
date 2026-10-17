const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpG1Script() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_1/code.html | grep -B 5 -A 100 "recentTasks ="');
    console.log("Glassmorphic1 Script:\n", res.stdout);
    
    // Also, I need to create a history endpoint in server.js!
    // Let's check if the user_tasks table exists and what columns it has.
    let res2 = await ssh.execCommand('sqlite3 /var/www/jmj_app/database.sqlite ".schema user_tasks"');
    console.log("User Tasks Schema:\n", res2.stdout);
    ssh.dispose();
}
dumpG1Script().catch(console.error);
