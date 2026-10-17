const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function getServer() {
    await ssh.connect({ host: '104.247.110.22', username: 'root', password: 'Apple2010@' });
    await ssh.getFile('C:/Users/ajom7/Downloads/TPR/JMJ_App/server_local.js', '/var/www/jmj_app/server.js');
    console.log("Downloaded!");
    ssh.dispose();
}
getServer().catch(console.error);
