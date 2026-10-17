const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function researchAppSpeed() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    // 1. Check loadPage logic in app.html
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/app.html | grep -A 20 "function loadPage"');
    console.log("loadPage Logic:\n", res.stdout);
    
    // 2. Check Cache-Control in server.js
    let res2 = await ssh.execCommand('grep -C 5 "express.static" /var/www/jmj_app/server.js');
    console.log("Static Cache:\n", res2.stdout);
    
    // 3. Check what background images are used in glassmorphic_2/code.html
    let res3 = await ssh.execCommand('grep -i "bg_main" /var/www/jmj_app/public/glassmorphic_2/code.html');
    console.log("Task Page Background:\n", res3.stdout);
    
    ssh.dispose();
}
researchAppSpeed().catch(console.error);
