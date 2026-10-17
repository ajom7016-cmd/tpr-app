const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepLogin() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -i -C 2 "demo preview" /var/www/jmj_app/public/login.html');
    console.log("LOGIN HTML: ", res.stdout);
    
    let res2 = await ssh.execCommand('grep -rn -i "demo preview" /var/www/jmj_app/public/js/');
    console.log("JS FOLDER: ", res2.stdout);
    
    // Also check if app.html is somehow still involved
    let res3 = await ssh.execCommand('grep -i "demo preview" /var/www/jmj_app/public/app.html');
    console.log("APP HTML: ", res3.stdout);
    ssh.dispose();
}
grepLogin().catch(console.error);
