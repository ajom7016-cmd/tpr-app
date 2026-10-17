const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function findLogin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/login.html | grep -B 5 -A 20 "fetch(\'/api/login\'"');
    console.log("Login:\n", res.stdout);
    
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/js/app.js | grep -A 20 "fetch(\'/api/profile\'"');
    console.log("App fetch:\n", res2.stdout);
    ssh.dispose();
}
findLogin().catch(console.error);
