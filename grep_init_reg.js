const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function grepInitiateRegistration() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -rn "function initiateRegistration" /var/www/jmj_app/public/');
    console.log("Output: ", res.stdout);
    
    // Also check how registration completes
    let res2 = await ssh.execCommand('grep -rn "/api/register" /var/www/jmj_app/public/ 2>/dev/null || echo "Not found"');
    console.log("Register endpoint usage: ", res2.stdout);
    ssh.dispose();
}
grepInitiateRegistration().catch(console.error);
