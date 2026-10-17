const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getPort() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    let res = await ssh.execCommand('grep -A 5 "app.listen" /var/www/jmj_app/server.js');
    console.log("Port: ", res.stdout);
    ssh.dispose();
}
getPort().catch(console.error);
