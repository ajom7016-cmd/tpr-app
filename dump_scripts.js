const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function dumpScripts() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/public/user_profile_premium_glass/code.html | grep -B 1 -A 50 "<script>"');
    console.log("Profile Script:\n", res.stdout);
    
    let res2 = await ssh.execCommand('cat /var/www/jmj_app/public/glassmorphic_2/code.html | grep -B 2 -A 30 "let pic ="');
    console.log("Tasks Script:\n", res2.stdout);
    ssh.dispose();
}
dumpScripts().catch(console.error);
