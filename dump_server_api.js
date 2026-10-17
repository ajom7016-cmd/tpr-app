const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpServerApi() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/server.js | grep -A 20 "app.get(\'/api/tasks\'"');
    console.log("Task API:\n", res.stdout);
    
    // Also check app.html to see what getRecentEarnings does
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -A 15 "getRecentEarnings:"');
    console.log("getRecentEarnings in app.html:\n", res2.stdout);
    ssh.dispose();
}
dumpServerApi().catch(console.error);
