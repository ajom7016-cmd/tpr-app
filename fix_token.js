const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function fixToken() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    
    let res = await ssh.execCommand("sed -i 's/localStorage.getItem(\\'token\\')/localStorage.getItem(\\'userToken\\')/g' /var/www/jmj_app/public/deposit_glass/code.html");
    console.log("Fix token:", res.stdout, res.stderr);
    
    ssh.dispose();
}
fixToken().catch(console.error);
