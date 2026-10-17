const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function analyzeDB() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('cat /var/www/jmj_app/database.js');
    console.log("DB JS:\n", res.stdout);
    ssh.dispose();
}
analyzeDB().catch(console.error);
