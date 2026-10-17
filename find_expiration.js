const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findExpiration() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -C 15 "Math.floor(daysActive)" /var/www/jmj_app/server.js');
    console.log("Expiration Logic:\n", res.stdout);
    
    // Also check what I need to change in app.html
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -B 5 -A 5 "dailyEarning: 10"');
    console.log("app.html logic:\n", res2.stdout);
    
    ssh.dispose();
}
findExpiration().catch(console.error);
